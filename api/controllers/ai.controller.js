import { Readable } from 'node:stream';
import { ToolLoopAgent, createAgentUIStreamResponse, stepCountIs, tool } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from 'zod';
import Property from '../models/property.model.js';
import User from '../models/user.model.js';
import City from '../models/city.model.js';


const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

const resolveCityIds = async (cityQuery) => {
    if (!cityQuery) return [];
    const cities = await City.find({ name: new RegExp(cityQuery, 'i') })
        .select('_id')
        .lean();
    return cities.map((c) => c._id);
};

const inferTypeFromQuery = (query) => {
    if (!query) return null;
    const text = query.toLowerCase();
    if (text.includes('house')) return 'house';
    if (text.includes('apartment') || text.includes('flat')) return 'apartment';
    if (text.includes('land') || text.includes('plot')) return 'land';
    if (text.includes('office')) return 'office';
    if (text.includes('commercial')) return 'commercial';
    return null;
};


const brokerSearchTool = tool({
    description: 'Find verified real estate brokers by name, company, or city.',
    inputSchema: z.object({
        query: z.string().optional(),
        city: z.string().optional(),
        limit: z.number().min(1).max(12).default(6),
    }),
    execute: async ({ query, city, limit }) => {
        const filter = { role: 'broker', isBrokerVerified: true };

        if (query) {
            const regex = new RegExp(query, 'i');
            filter.$or = [{ name: regex }, { company: regex }];
        }

        if (city) {
            const cityIds = await resolveCityIds(city);
            if (cityIds.length === 0) return { brokers: [], search: { query, city, limit } };
            filter.city = { $in: cityIds };
        }

        const brokers = await User.find(filter)
            .select('name company email phone profileImage city')
            .populate('city', 'name')
            .limit(limit)
            .lean();

        return {
            brokers: brokers.map((b) => ({
                id: b._id,
                name: b.name,
                company: b.company ?? null,
                email: b.email,
                phone: b.phone,
                profileImage: b.profileImage ?? null,
                city: b.city?.name ?? null,
                profileUrl: `/brokers/${b._id}`,
            })),
            search: { query: query ?? null, city: city ?? null, limit },
        };
    },
});

const propertySearchTool = tool({
    description: 'Find approved properties by filters like city, price, type, and purpose.',
    inputSchema: z.object({
        query: z.string().optional(),
        city: z.string().optional(),
        purpose: z.enum(['sale', 'rent', 'buy']).optional(),
        type: z.enum(['apartment', 'land', 'house', 'commercial', 'office']).optional(),
        priceMin: z.number().min(0).optional(),
        priceMax: z.number().min(0).optional(),
        bedrooms: z.number().min(0).optional(),
        bathrooms: z.number().min(0).optional(),
        limit: z.number().min(1).max(12).default(6),
    }),
    execute: async ({ query, city, purpose, type, priceMin, priceMax, bedrooms, bathrooms, limit }) => {
        const filter = { status: 'approved' };

        const resolvedType = type ?? inferTypeFromQuery(query);
        if (resolvedType) filter.type = resolvedType;

        if (query) {
            const regex = new RegExp(query, 'i');
            filter.$or = [
                { title: regex },
                { description: regex },
                { 'location.address': regex },
            ];
        }

        if (city) {
            const cityIds = await resolveCityIds(city);
            if (cityIds.length === 0) return { properties: [], search: buildPropertySearchMeta({ query, city, purpose, resolvedType, priceMin, priceMax, bedrooms, bathrooms, limit }) };
            filter.city = { $in: cityIds };
        }

        if (purpose) {
            filter.purpose = purpose === 'buy' ? 'sale' : purpose;
        }

        if (priceMin !== undefined || priceMax !== undefined) {
            filter.price = {};
            if (priceMin !== undefined) filter.price.$gte = priceMin;
            if (priceMax !== undefined) filter.price.$lte = priceMax;
        }

        if (bedrooms !== undefined) filter.bedrooms = bedrooms;
        if (bathrooms !== undefined) filter.bathrooms = bathrooms;

        const properties = await Property.find(filter)
            .select('title price purpose type images city location bedrooms bathrooms parking size rentalType')
            .populate('city', 'name')
            .limit(limit)
            .lean();

        return {
            properties: properties.map((p) => ({
                _id: p._id,
                title: p.title,
                price: p.price,
                purpose: p.purpose,
                type: p.type,
                images: p.images ?? [],
                city: p.city,
                location: p.location,
                bedrooms: p.bedrooms ?? null,
                bathrooms: p.bathrooms ?? null,
                parking: p.parking ?? null,
                size: p.size ?? null,
                rentalType: p.rentalType ?? null,
            })),
            search: buildPropertySearchMeta({ query, city, purpose, resolvedType, priceMin, priceMax, bedrooms, bathrooms, limit }),
        };
    },
});

const buildPropertySearchMeta = ({ query, city, purpose, resolvedType, priceMin, priceMax, bedrooms, bathrooms, limit }) => ({
    query: query ?? null,
    city: city ?? null,
    purpose: purpose ?? null,
    type: resolvedType ?? null,
    priceMin: priceMin ?? null,
    priceMax: priceMax ?? null,
    bedrooms: bedrooms ?? null,
    bathrooms: bathrooms ?? null,
    limit,
});


const brokerPropertyAgent = new ToolLoopAgent({
    model: openrouter.chat('openrouter/free', {
        /* reasoning: {
            enabled: false
        }, */
        temperature: 0.7
    }),
    instructions:
        'You are a real estate assistant for Nepal. Use tools to look up brokers or properties. ' +
        'Always pass precise location keywords (neighbourhood/area) in the tool query and the city name in the city input when the user mentions it. ' +
        'Be concise and show a short list with key details and links. ' +
        'If key filters are missing (type, city, purpose), ask a brief clarifying question before searching.',
    tools: {
        searchBrokers: brokerSearchTool,
        searchProperties: propertySearchTool,
    },

    stopWhen: stepCountIs(3),
});


export const brokerPropertyChat = async (req, res, next) => {
    try {
        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(500).json({ message: 'OPENROUTER_API_KEY is not configured on the server.' });
        }

        const { messages = [] } = req.body ?? {};

        const response = await createAgentUIStreamResponse({
            agent: brokerPropertyAgent,
            uiMessages: messages,
        });

        res.status(response.status);
        response.headers.forEach((value, key) => res.setHeader(key, value));

        if (!response.body) return res.end();

        Readable.fromWeb(response.body).pipe(res);
    } catch (error) {
        next(error);
    }
};