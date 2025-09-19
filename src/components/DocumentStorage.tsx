import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, FolderLock, Upload, File, Trash2, Download, Eye, Shield, Calendar, FileText } from 'lucide-react';

type DocumentStorageProps = {
  user: {
    id: string;
    email: string;
    name: string;
    studentId?: string;
  };
  onNavigate: (page: string) => void;
};

type Document = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  category: 'passport' | 'visa' | 'id' | 'ticket' | 'insurance' | 'other';
  url?: string;
};

export function DocumentStorage({ user, onNavigate }: DocumentStorageProps) {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Passport_Copy.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      category: 'passport'
    },
    {
      id: '2',
      name: 'Student_ID.jpg',
      type: 'Image',
      size: '856 KB',
      uploadDate: '2024-01-10',
      category: 'id'
    },
    {
      id: '3',
      name: 'Flight_Ticket.pdf',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: '2024-01-20',
      category: 'ticket'
    }
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'all', name: 'All Documents', icon: FileText },
    { id: 'passport', name: 'Passport', icon: FileText },
    { id: 'visa', name: 'Visa', icon: FileText },
    { id: 'id', name: 'ID Cards', icon: FileText },
    { id: 'ticket', name: 'Tickets', icon: FileText },
    { id: 'insurance', name: 'Insurance', icon: Shield },
    { id: 'other', name: 'Other', icon: File }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    for (const file of files) {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newDocument: Document = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'Image' : 'Document',
        size: formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0],
        category: 'other'
      };

      setDocuments(prev => [...prev, newDocument]);
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const downloadDocument = (document: Document) => {
    // In a real app, this would download the actual file
    alert(`Downloading ${document.name}`);
  };

  const previewDocument = (document: Document) => {
    // In a real app, this would open a preview modal
    alert(`Previewing ${document.name}`);
  };

  const updateDocumentCategory = (id: string, category: string) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, category: category as any } : doc
    ));
  };

  const getFilteredDocuments = () => {
    if (selectedCategory === 'all') return documents;
    return documents.filter(doc => doc.category === selectedCategory);
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? categoryData.icon : File;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      passport: 'bg-blue-100 text-blue-700',
      visa: 'bg-purple-100 text-purple-700',
      id: 'bg-green-100 text-green-700',
      ticket: 'bg-orange-100 text-orange-700',
      insurance: 'bg-red-100 text-red-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.other;
  };

  const filteredDocuments = getFilteredDocuments();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <FolderLock className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl">Secure Documents</h1>
              </div>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    const count = category.id === 'all' 
                      ? documents.length 
                      : documents.filter(doc => doc.category === category.id).length;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors ${
                          selectedCategory === category.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-4 w-4 text-gray-500" />
                          <span className={selectedCategory === category.id ? 'text-blue-600' : ''}>{category.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">{count}</Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="mt-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium">Secure Storage</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• End-to-end encryption</p>
                  <p>• Automatic backups</p>
                  <p>• Secure cloud storage</p>
                  <p>• Access from anywhere</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents Grid */}
          <div className="lg:col-span-3">
            {/* Upload Area */}
            <Card className="mb-6 border-2 border-dashed border-gray-300 bg-gray-50">
              <CardContent className="p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg mb-2">Upload Travel Documents</h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  variant="outline"
                >
                  Choose Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-3">
                  Supported: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)
                </p>
              </CardContent>
            </Card>

            {/* Documents List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl">
                  {selectedCategory === 'all' ? 'All Documents' : categories.find(c => c.id === selectedCategory)?.name} 
                  ({filteredDocuments.length})
                </h2>
              </div>

              {filteredDocuments.length === 0 ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="p-8 text-center">
                    <File className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg text-gray-500 mb-2">No documents found</h3>
                    <p className="text-gray-400">Upload your first document to get started</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocuments.map((document) => {
                    const IconComponent = getCategoryIcon(document.category);
                    return (
                      <Card key={document.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <IconComponent className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-sm truncate max-w-32">{document.name}</p>
                                <p className="text-xs text-gray-500">{document.type} • {document.size}</p>
                              </div>
                            </div>
                            <Badge className={`text-xs ${getCategoryColor(document.category)}`}>
                              {categories.find(c => c.id === document.category)?.name}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => previewDocument(document)}
                              className="h-8 flex-1"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadDocument(document)}
                              className="h-8 flex-1"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteDocument(document.id)}
                              className="h-8 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Category Selector */}
                          <div className="mt-3">
                            <select
                              value={document.category}
                              onChange={(e) => updateDocumentCategory(document.id, e.target.value)}
                              className="w-full text-xs p-2 border rounded"
                            >
                              {categories.slice(1).map(category => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Document Security Tips */}
        <Card className="mt-8 border-0 shadow-md bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <h3 className="text-lg mb-4">📄 Document Safety Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-2">• Always keep digital copies of important documents</p>
                <p className="mb-2">• Upload documents in high resolution</p>
                <p className="mb-2">• Organize documents by category for easy access</p>
              </div>
              <div>
                <p className="mb-2">• Never share personal documents publicly</p>
                <p className="mb-2">• Keep physical copies as backup</p>
                <p className="mb-2">• Update expired documents promptly</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}