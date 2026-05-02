import { useState, useRef, useEffect } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { adminService, propertyService } from '../services/apiService';
import Papa from 'papaparse';
import toast from 'react-hot-toast';

export default function AdminPropertyImport() {
  const fileInputRef = useRef(null);
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [showMapping, setShowMapping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brokers, setBrokers] = useState([]);
  const [selectedBroker, setSelectedBroker] = useState('');
  const [brokersLoading, setBrokersLoading] = useState(true);
  const [importingRows, setImportingRows] = useState(new Set());
  const [importStatus, setImportStatus] = useState({});
  const [previewRows, setPreviewRows] = useState(5);

  // Field mapping: CSV header -> Property field
  const [fieldMapping, setFieldMapping] = useState({
    title: '',
    description: '',
    price: '',
    type: '',
    purpose: '',
    city: '',
    address: '',
    lat: '',
    lng: '',
    size: '',
    sizeUnit: '',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    amenities: '',
    rentalType: '',
    images: '',
  });

  const propertyTypes = ['apartment', 'land', 'house', 'commercial', 'office'];
  const purposeTypes = ['sale', 'rent'];
  const sizeUnits = ['sqft', 'ropani'];
  const rentalTypes = ['daily', 'monthly', 'yearly'];

  // Fetch brokers on mount
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        setBrokersLoading(true);
        const response = await adminService.getAllBrokers({ limit: 1000 });
        setBrokers(response.data.brokers || []);
      } catch (err) {
        console.error('Failed to fetch brokers:', err);
      } finally {
        setBrokersLoading(false);
      }
    };

    fetchBrokers();
  }, []);

  // Handle CSV file selection
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (parsed) => {
        if (parsed.data.length === 0) {
          alert('CSV file is empty');
          return;
        }
        const headers = Object.keys(parsed.data[0] || {});
        setCsvHeaders(headers);
        setCsvData(parsed.data);

        // Auto-detect field mappings based on column names
        const autoMapping = autoDetectMapping(headers);
        setFieldMapping(autoMapping);

        setShowMapping(true);
        setImportStatus({});
      },
      error: (err) => {
        alert(`Error parsing CSV: ${err.message}`);
      },
    });
  };

  // Auto-detect field mappings based on common column names
  const autoDetectMapping = (headers) => {
    const mapping = {
      title: '',
      description: '',
      price: '',
      type: '',
      purpose: '',
      city: '',
      address: '',
      lat: '',
      lng: '',
      size: '',
      sizeUnit: '',
      bedrooms: '',
      bathrooms: '',
      parking: '',
      amenities: '',
      rentalType: '',
      images: '',
    };

    const lowerHeaders = headers.map(h => h.toLowerCase());

    headers.forEach((header, idx) => {
      const lower = header.toLowerCase();

      // Title
      if (lower.includes('title') || lower.includes('name')) mapping.title = header;

      // Description
      if (lower.includes('description') || lower.includes('desc')) mapping.description = header;

      // Price
      if (lower.includes('price') || lower.includes('cost')) mapping.price = header;

      // Type (Property Type)
      if (lower.includes('property type') || lower.includes('category')) mapping.type = header;

      // Purpose (Sale/Rent)
      if (lower.includes('type') && !lower.includes('property')) mapping.purpose = header;

      // City
      if (lower.includes('city')) mapping.city = header;

      // Address
      if (lower.includes('address') || lower.includes('location')) mapping.address = header;

      // Latitude
      if (lower.includes('latitude') || lower.includes('lat')) mapping.lat = header;

      // Longitude
      if (lower.includes('longitude') || lower.includes('lng')) mapping.lng = header;

      // Size/Area
      if (lower.includes('size') || lower.includes('area')) mapping.size = header;

      // Bedrooms
      if (lower.includes('bedroom') || lower.includes('bed')) mapping.bedrooms = header;

      // Bathrooms
      if (lower.includes('bathroom') || lower.includes('bath')) mapping.bathrooms = header;

      // Parking
      if (lower.includes('parking') || lower.includes('park')) mapping.parking = header;

      // Amenities
      if (lower.includes('amenities') || lower.includes('amenity')) mapping.amenities = header;

      // Rental Type
      if (lower.includes('rental')) mapping.rentalType = header;

      // Images
      if (lower.includes('image') || lower.includes('photo') || lower.includes('url')) mapping.images = header;
    });

    return mapping;
  };

  // Update field mapping
  const handleMappingChange = (propertyField, csvHeader) => {
    setFieldMapping(prev => ({
      ...prev,
      [propertyField]: csvHeader
    }));
  };

  // Preview CSV data
  const getPreviewData = () => {
    return csvData.slice(0, previewRows).map((row, idx) => ({
      index: idx,
      data: row
    }));
  };

  // Download sample CSV
  const downloadSample = () => {
    const sampleData = [
      {
        'Property Title': 'Beautiful 2-Bedroom Apartment',
        'Description': 'Spacious apartment in prime location',
        'Price (Rs.)': '5000000',
        'Property Type': 'apartment',
        'Purpose': 'sale',
        'City': 'Kathmandu',
        'Address': '123 Main Street, Kathmandu',
        'Latitude': '27.7172',
        'Longitude': '85.3240',
        'Size (Number)': '1500',
        'Size Unit': 'sqft',
        'Bedrooms': '2',
        'Bathrooms': '2',
        'Parking Spaces': '1',
        'Amenities': 'Gym,Security,Water Supply',
        'Rental Type': '',
        'Image URLs': 'https://example.com/img1.jpg,https://example.com/img2.jpg'
      },
      {
        'Property Title': 'Land Plot in Valley',
        'Description': 'Prime land for development',
        'Price (Rs.)': '2000000',
        'Property Type': 'land',
        'Purpose': 'sale',
        'City': 'Kathmandu',
        'Address': '456 Valley Road, Kathmandu',
        'Latitude': '27.7200',
        'Longitude': '85.3300',
        'Size (Number)': '50',
        'Size Unit': 'ropani',
        'Bedrooms': '',
        'Bathrooms': '',
        'Parking Spaces': '',
        'Amenities': '',
        'Rental Type': '',
        'Image URLs': 'https://example.com/land.jpg'
      }
    ];

    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'properties-sample.csv';
    a.click();
  };

  // Get mapped value from row
  const getMappedValue = (row, field) => {
    const csvHeader = fieldMapping[field];
    return csvHeader ? row[csvHeader]?.trim() : '';
  };

  // Parse area with mixed units (e.g., "21 Aana", "1500 Sq. Feet", "1500 sqft")
  const parseArea = (areaStr) => {
    if (!areaStr) return { value: null, unit: 'sqft' };

    const normalized = areaStr.toLowerCase().trim();

    // Try to extract ropani
    if (normalized.includes('aana') || normalized.includes('anna')) {
      const match = normalized.match(/[\d.]+/);
      if (match) {
        return { value: Number(match[0]), unit: 'ropani' };
      }
    }

    // Try to extract sqft or sq. feet
    const sqftMatch = normalized.match(/[\d.]+/);
    if (sqftMatch) {
      return { value: Number(sqftMatch[0]), unit: 'sqft' };
    }

    return { value: null, unit: 'sqft' };
  };

  // Parse amenities from various formats (JSON string or comma separated)
  const parseAmenities = (amenitiesStr) => {
    if (!amenitiesStr) return [];

    try {
      // Try parsing as JSON array
      const parsed = JSON.parse(amenitiesStr);
      if (Array.isArray(parsed)) {
        return parsed.map(a => a.trim()).filter(Boolean);
      }
    } catch {
      // Not JSON, try comma-separated
    }

    // Parse as comma-separated
    return amenitiesStr
      .split(',')
      .map(a => a.replace(/[\[\]'"]/g, '').trim())
      .filter(Boolean);
  };

  // Validate and prepare row for import
  const prepareRow = (row) => {
    const title = getMappedValue(row, 'title');
    const description = getMappedValue(row, 'description');
    const price = getMappedValue(row, 'price');
    const type = getMappedValue(row, 'type');
    const purpose = getMappedValue(row, 'purpose');
    const cityName = getMappedValue(row, 'city');
    const address = getMappedValue(row, 'address');
    const lat = getMappedValue(row, 'lat');
    const lng = getMappedValue(row, 'lng');
    const sizeStr = getMappedValue(row, 'size');
    const bedrooms = getMappedValue(row, 'bedrooms');
    const bathrooms = getMappedValue(row, 'bathrooms');
    const parking = getMappedValue(row, 'parking');
    const amenitiesStr = getMappedValue(row, 'amenities');
    const rentalType = getMappedValue(row, 'rentalType');
    const imagesStr = getMappedValue(row, 'images');

    // Parse area
    const { value: sizeValue, unit: sizeUnit } = parseArea(sizeStr);

    // Validate required fields
    const errors = [];
    if (!title) errors.push('Title required');
    if (!description || description === 'N/A') errors.push('Description required');
    if (!price || isNaN(Number(price.replace(/,/g, '')))) errors.push('Valid price required');
    if (!type || !propertyTypes.includes(type.toLowerCase())) errors.push(`Invalid type: ${type}`);
    if (!purpose || !purposeTypes.includes(purpose.toLowerCase())) errors.push(`Invalid purpose: ${purpose}`);
    if (!cityName) errors.push('City required');
    if (!address) errors.push('Address required');
    if (!lat || isNaN(Number(lat))) errors.push('Valid latitude required');
    if (!lng || isNaN(Number(lng))) errors.push('Valid longitude required');
    if (!sizeValue || isNaN(sizeValue)) errors.push('Valid size required');

    if (errors.length > 0) {
      return { error: errors.join('; ') };
    }

    return {
      title: title.substring(0, 100).trim(),
      description: (description || 'Premium property').substring(0, 500).trim(),
      price: Number(price.toString().replace(/,/g, '')),
      type: type.toLowerCase(),
      purpose: purpose.toLowerCase(),
      cityName: cityName.trim(),
      location: {
        address: address.trim(),
        lat: Number(lat),
        lng: Number(lng),
      },
      size: {
        value: sizeValue,
        unit: sizeUnit,
      },
      bedrooms: bedrooms && bedrooms !== '' && !isNaN(Number(bedrooms)) ? Number(bedrooms) : null,
      bathrooms: bathrooms && bathrooms !== '' && !isNaN(Number(bathrooms)) ? Number(bathrooms) : null,
      parking: parking && parking !== '' && !isNaN(Number(parking)) ? Number(parking) : null,
      amenities: parseAmenities(amenitiesStr),
      rentalType: rentalType && rentalType.toLowerCase() ? rentalType.toLowerCase() : null,
      images: imagesStr ? imagesStr.split(',').map(img => img.trim()).filter(Boolean).slice(0, 5) : [],
    };
  };

  // Import single row
  const importRow = async (rowIndex) => {
    setImportingRows(prev => new Set([...prev, rowIndex]));
    const row = csvData[rowIndex];

    try {
      const prepared = prepareRow(row);
      if (prepared.error) {
        setImportStatus(prev => ({
          ...prev,
          [rowIndex]: { error: prepared.error }
        }));
        return;
      }

      // Call API to import (we'll create this endpoint next)
      const response = await fetch('/api/admin/properties/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...prepared,
          brokerId: selectedBroker,
        }),
      });

      if (response.ok) {
        setImportStatus(prev => ({
          ...prev,
          [rowIndex]: { success: true }
        }));
        toast.success(`Row ${rowIndex + 1} imported successfully`);
      } else {
        const error = await response.json();
        toast.error(`Row ${rowIndex + 1} failed: ${error.message || 'Import failed'}`);
        setImportStatus(prev => ({
          ...prev,
          [rowIndex]: { error: error.message || 'Import failed' }
        }));
      }
    } catch (err) {
      setImportStatus(prev => ({
        ...prev,
        [rowIndex]: { error: err.message }
      }));
    } finally {
      setImportingRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(rowIndex);
        return newSet;
      });
    }
  };

  // Import all rows
  const importAll = async () => {
    if (!selectedBroker) {
      alert('Please select a broker');
      return;
    }

    setLoading(true);
    for (let i = 0; i < csvData.length; i++) {
      await importRow(i);
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bulk Property Import
          </h1>
          <p>
            Import multiple properties from a CSV file with field mapping
          </p>
        </div>

        {!showMapping ? (
          // Step 1: Upload CSV
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-600 rounded-md p-12 text-center hover:border-primary transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Upload CSV File
                </h3>
                <p className="mb-4">
                  Drag and drop your CSV file here, or click to select
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Choose File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={downloadSample}
                  className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Sample CSV
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Step 2: Field Mapping
          <>
            <div className="bg-blue-50 dark:bg-[#1a3a4a] border border-blue-200 dark:border-[#2a5a7a] rounded-lg p-4 mb-8 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Step 1: Map CSV columns to property fields
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  {csvData.length} rows found in CSV. Select which CSV column maps to each property field.
                </p>
              </div>
            </div>

            {/* Broker Selection */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 mb-6">
              <label className="block font-semibold mb-3">
                Select Broker (Required)
              </label>
              {brokersLoading ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Loading brokers...
                </div>
              ) : (
                <select
                  value={selectedBroker}
                  onChange={(e) => setSelectedBroker(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Select a broker --</option>
                  {brokers.map(broker => (
                    <option key={broker._id} value={broker._id}>
                      {broker.name} ({broker.email})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Field Mapping Grid */}
            <div className="p-6 mb-6">
              <h2 className="text-lg font-semibold mb-2">
                Map CSV Columns
              </h2>
              <p className="text-sm mb-4">
                Auto-detected columns are pre-filled. Adjust as needed.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(fieldMapping).map(field => {
                  const isMapped = !!fieldMapping[field];
                  const isRequired = ['title', 'description', 'price', 'type', 'purpose', 'city', 'address', 'lat', 'lng', 'size'].includes(field);

                  return (
                    <div key={field} className={`p-3 rounded-lg border ${isMapped ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/60' : 'border-transparent'}`}>
                      <label className="block text-sm font-medium mb-2 capitalize">
                        {field === 'lat' ? 'Latitude' : field === 'lng' ? 'Longitude' : field === 'sizeUnit' ? 'Size Unit (sqft/ropani)' : field}
                        {isRequired && (
                          <span className="text-primary">*</span>
                        )}
                        {isMapped && (
                            <span className="text-green-600 dark:text-green-400 text-xs ml-2">✓ Detected</span>
                        )}
                      </label>
                      <select
                        value={fieldMapping[field]}
                        onChange={(e) => handleMappingChange(field, e.target.value)}
                          className={`border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none ${isMapped
                            ? 'border-green-300 dark:border-green-700 focus:ring-green-500'
                            : 'border-neutral-200 dark:border-neutral-800 focus:ring-primary'
                          }`}
                      >
                        <option value="">-- Not Mapped --</option>
                        {csvHeaders.map(header => (
                          <option key={header} value={header}>
                            {header}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Preview Data
              </h2>
              <div className="mb-4">
                <label className="text-sm">
                  Show first
                  <input
                    type="number"
                    min="1"
                    max={csvData.length}
                    value={previewRows}
                    onChange={(e) => setPreviewRows(Number(e.target.value))}
                    className="w-16 mx-2 px-2 py-1 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-700"
                  />
                  rows
                </label>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800">
                      <th className="text-left py-3 px-4 font-semibold">#</th>
                      <th className="text-left py-3 px-4 font-semibold">Title</th>
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Price</th>
                      <th className="text-left py-3 px-4 font-semibold">City</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPreviewData().map(({ index, data }) => {
                      const status = importStatus[index];
                      return (
                        <tr key={index} className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                          <td className="py-3 px-4 text-neutral-500">{index + 1}</td>
                          <td className="py-3 px-4 truncate">
                            {getMappedValue(data, 'title') || '(empty)'}
                          </td>
                          <td className="py-3 px-4">
                            {getMappedValue(data, 'type') || '(empty)'}
                          </td>
                          <td className="py-3 px-4">
                            {getMappedValue(data, 'price') || '(empty)'}
                          </td>
                          <td className="py-3 px-4">
                            {getMappedValue(data, 'city') || '(empty)'}
                          </td>
                          <td className="py-3 px-4">
                            {status?.success ? (
                              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                <CheckCircle className="w-4 h-4" />
                              </span>
                            ) : status?.error ? (
                              <span className="text-red-600 dark:text-red-400 text-xs" title={status.error}>
                                Error
                              </span>
                            ) : importingRows.has(index) ? (
                              <Loader className="w-4 h-4 animate-spin text-primary" />
                            ) : (
                              <span className="text-neutral-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowMapping(false);
                  setCsvData([]);
                  setCsvHeaders([]);
                  setFieldMapping({
                    title: '', description: '', price: '', type: '', purpose: '',
                    city: '', address: '', lat: '', lng: '', size: '', sizeUnit: '',
                    bedrooms: '', bathrooms: '', parking: '', amenities: '', rentalType: '', images: ''
                  });
                }}
                className="px-6 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={importAll}
                disabled={loading || !selectedBroker}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Import All {csvData.length} Properties
              </button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
