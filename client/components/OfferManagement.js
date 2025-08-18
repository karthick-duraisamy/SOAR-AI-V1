import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { Search, Filter, Plus, Edit, Trash2, Send, Eye, Download, Upload, DollarSign, TrendingUp, TrendingDown, Users, Building2, Target, Award, AlertCircle, BarChart3, LineChart, Activity, Zap, Brain, Sparkles, FileText, RefreshCw, Copy, ExternalLink, Database, Server, Shield, ShoppingCart, Percent, Tag } from 'lucide-react';
// Mock data for offers
const mockOffers = [
    {
        id: 'OFF-001',
        title: 'Premium Business Class Package',
        corporate: 'TechCorp International',
        type: 'Route-based',
        status: 'Active',
        validFrom: '2024-01-15',
        validTo: '2024-12-31',
        discount: 25,
        usage: 85,
        conversion: 78,
        revenue: 2450000,
        bookings: 1247,
        routes: ['NYC-LON', 'SFO-FRA', 'LAX-NRT'],
        cabin: 'Business',
        atpcoStatus: 'Filed',
        atpcoReference: 'ATP-2024-001',
        lastModified: '2024-01-20',
        template: 'Corporate Premium',
        priority: 'High',
        description: 'Comprehensive business class travel package for TechCorp International with flexible routing options and enhanced service features.',
        terms: 'Valid for bookings made 30 days in advance. Includes lounge access, priority boarding, and 2 free changes per ticket.',
        minSpend: 100000,
        maxDiscount: 30,
        contactPerson: 'Sarah Johnson',
        contactEmail: 'sarah.johnson@techcorp.com',
        approvalStatus: 'Approved',
        createdBy: 'John Smith',
        lastEditedBy: 'Alice Brown',
        appliedDiscounts: ['DISC-001', 'DISC-003'],
        promoCodes: ['PROMO-001']
    },
    {
        id: 'OFF-002',
        title: 'Economy Plus Group Rates',
        corporate: 'Global Manufacturing Ltd',
        type: 'Volume-based',
        status: 'Active',
        validFrom: '2024-02-01',
        validTo: '2024-11-30',
        discount: 15,
        usage: 62,
        conversion: 65,
        revenue: 1780000,
        bookings: 892,
        routes: ['ORD-FRA', 'DET-MUC'],
        cabin: 'Economy Plus',
        atpcoStatus: 'Pending',
        atpcoReference: 'ATP-2024-002',
        lastModified: '2024-02-05',
        template: 'Volume Discount',
        priority: 'Medium',
        description: 'Volume-based pricing structure for Global Manufacturing with guaranteed group discounts and flexible travel dates.',
        terms: 'Minimum 50 passengers per booking period. Group discounts apply automatically. Free seat selection for Economy Plus.',
        minSpend: 75000,
        maxDiscount: 20,
        contactPerson: 'Mike Wilson',
        contactEmail: 'mike.wilson@globalmanuf.com',
        approvalStatus: 'Approved',
        createdBy: 'Jane Doe',
        lastEditedBy: 'John Smith',
        appliedDiscounts: ['DISC-002'],
        promoCodes: ['PROMO-002']
    },
    {
        id: 'OFF-003',
        title: 'Financial Services Executive',
        corporate: 'Sunrise Financial Services',
        type: 'Flexible',
        status: 'Draft',
        validFrom: '2024-03-01',
        validTo: '2024-12-31',
        discount: 30,
        usage: 0,
        conversion: 0,
        revenue: 0,
        bookings: 0,
        routes: ['JFK-LHR', 'LAX-HKG', 'SFO-SIN'],
        cabin: 'First',
        atpcoStatus: 'Not Filed',
        atpcoReference: '',
        lastModified: '2024-02-28',
        template: 'Executive Premium',
        priority: 'High',
        description: 'Premium first-class travel package for Sunrise Financial executives with maximum flexibility and luxury amenities.',
        terms: 'Unlimited changes allowed. Includes concierge service, private car transfers, and premium hotel partnerships.',
        minSpend: 200000,
        maxDiscount: 35,
        contactPerson: 'David Chen',
        contactEmail: 'david.chen@sunrise.com',
        approvalStatus: 'Pending Review',
        createdBy: 'Alice Brown',
        lastEditedBy: 'Alice Brown',
        appliedDiscounts: ['DISC-001', 'DISC-004'],
        promoCodes: ['PROMO-003']
    }
];
// Mock data for discounts
const mockDiscounts = [
    {
        id: 'DISC-001',
        name: 'Early Bird Discount',
        type: 'Percentage',
        value: 15,
        description: 'Discount for bookings made 60 days in advance',
        status: 'Active',
        validFrom: '2024-01-01',
        validTo: '2024-12-31',
        minSpend: 500,
        maxDiscount: 200,
        usageLimit: 1000,
        usedCount: 245,
        applicableRoutes: 'All Routes',
        corporateOnly: false,
        createdBy: 'John Smith',
        lastModified: '2024-01-15'
    },
    {
        id: 'DISC-002',
        name: 'Volume Discount',
        type: 'Percentage',
        value: 20,
        description: 'Bulk booking discount for 10+ passengers',
        status: 'Active',
        validFrom: '2024-01-01',
        validTo: '2024-12-31',
        minSpend: 5000,
        maxDiscount: 1000,
        usageLimit: 500,
        usedCount: 89,
        applicableRoutes: 'International',
        corporateOnly: true,
        createdBy: 'Jane Doe',
        lastModified: '2024-01-12'
    },
    {
        id: 'DISC-003',
        name: 'Student Discount',
        type: 'Fixed',
        value: 100,
        description: 'Fixed discount for verified students',
        status: 'Active',
        validFrom: '2024-01-01',
        validTo: '2024-12-31',
        minSpend: 300,
        maxDiscount: 100,
        usageLimit: 2000,
        usedCount: 567,
        applicableRoutes: 'All Routes',
        corporateOnly: false,
        createdBy: 'Mike Wilson',
        lastModified: '2024-01-10'
    },
    {
        id: 'DISC-004',
        name: 'Corporate Premium Discount',
        type: 'Percentage',
        value: 25,
        description: 'Premium discount for enterprise clients',
        status: 'Active',
        validFrom: '2024-02-01',
        validTo: '2024-12-31',
        minSpend: 10000,
        maxDiscount: 2500,
        usageLimit: 100,
        usedCount: 23,
        applicableRoutes: 'All Routes',
        corporateOnly: true,
        createdBy: 'Sarah Johnson',
        lastModified: '2024-02-01'
    }
];
// Mock data for promo codes
const mockPromoCodes = [
    {
        id: 'PROMO-001',
        code: 'SAVE2024',
        name: 'New Year Promotion',
        type: 'Percentage',
        value: 10,
        description: 'New Year special offer for all bookings',
        status: 'Active',
        validFrom: '2024-01-01',
        validTo: '2024-03-31',
        usageLimit: 5000,
        usedCount: 1234,
        minSpend: 200,
        maxDiscount: 150,
        singleUse: false,
        corporateOnly: false,
        createdBy: 'John Smith',
        lastModified: '2024-01-01'
    },
    {
        id: 'PROMO-002',
        code: 'BIZTRAVEL',
        name: 'Business Travel Special',
        type: 'Fixed',
        value: 75,
        description: 'Special promotion for business travelers',
        status: 'Active',
        validFrom: '2024-02-01',
        validTo: '2024-06-30',
        usageLimit: 1000,
        usedCount: 342,
        minSpend: 800,
        maxDiscount: 75,
        singleUse: true,
        corporateOnly: true,
        createdBy: 'Jane Doe',
        lastModified: '2024-02-01'
    },
    {
        id: 'PROMO-003',
        code: 'SUMMER20',
        name: 'Summer Vacation Deal',
        type: 'Percentage',
        value: 20,
        description: 'Summer holiday discount for leisure travel',
        status: 'Draft',
        validFrom: '2024-06-01',
        validTo: '2024-08-31',
        usageLimit: 3000,
        usedCount: 0,
        minSpend: 500,
        maxDiscount: 300,
        singleUse: false,
        corporateOnly: false,
        createdBy: 'Mike Wilson',
        lastModified: '2024-02-15'
    },
    {
        id: 'PROMO-004',
        code: 'FIRSTCLASS',
        name: 'First Class Upgrade',
        type: 'Percentage',
        value: 30,
        description: 'Exclusive discount for first class bookings',
        status: 'Active',
        validFrom: '2024-01-15',
        validTo: '2024-12-31',
        usageLimit: 200,
        usedCount: 45,
        minSpend: 2000,
        maxDiscount: 1000,
        singleUse: true,
        corporateOnly: false,
        createdBy: 'David Chen',
        lastModified: '2024-01-15'
    }
];
// Mock templates data
const mockTemplates = [
    {
        id: 'TPL-001',
        name: 'Corporate Premium',
        description: 'Premium offers for large corporates with business class focus',
        discount: '20-30%',
        cabin: 'Business/First',
        usage: 156,
        category: 'Premium',
        features: ['Lounge Access', 'Priority Boarding', 'Flexible Changes', 'Premium Seats'],
        basePrice: 5000,
        validityPeriod: '12 months'
    },
    {
        id: 'TPL-002',
        name: 'Volume Discount',
        description: 'Volume-based pricing for frequent travelers and large groups',
        discount: '10-20%',
        cabin: 'All Classes',
        usage: 98,
        category: 'Volume',
        features: ['Group Discounts', 'Flexible Dates', 'Free Seat Selection', 'Bulk Booking'],
        basePrice: 3000,
        validityPeriod: '6 months'
    },
    {
        id: 'TPL-003',
        name: 'Executive Premium',
        description: 'Executive level travel packages with maximum luxury',
        discount: '25-35%',
        cabin: 'First',
        usage: 67,
        category: 'Executive',
        features: ['Concierge Service', 'Private Transfers', 'Hotel Partnerships', 'Unlimited Changes'],
        basePrice: 8000,
        validityPeriod: '24 months'
    },
    {
        id: 'TPL-004',
        name: 'SME Business',
        description: 'Tailored offers for small and medium enterprises',
        discount: '12-18%',
        cabin: 'Economy Plus',
        usage: 89,
        category: 'SME',
        features: ['Cost Effective', 'Flexible Booking', 'Basic Amenities', 'Online Management'],
        basePrice: 2500,
        validityPeriod: '9 months'
    }
];
// Mock analytics data with real visualizations
const analyticsData = {
    overview: {
        totalOffers: 124,
        activeOffers: 89,
        totalRevenue: 12450000,
        averageConversion: 72,
        totalBookings: 5678,
        topPerformer: 'TechCorp International'
    },
    performance: {
        conversionTrend: [
            { month: 'Jan', conversion: 65, revenue: 2100000, bookings: 450 },
            { month: 'Feb', conversion: 68, revenue: 2300000, bookings: 520 },
            { month: 'Mar', conversion: 71, revenue: 2450000, bookings: 580 },
            { month: 'Apr', conversion: 74, revenue: 2600000, bookings: 620 },
            { month: 'May', conversion: 72, revenue: 2550000, bookings: 610 },
            { month: 'Jun', conversion: 75, revenue: 2700000, bookings: 650 },
            { month: 'Jul', conversion: 78, revenue: 2850000, bookings: 680 }
        ],
        topPerformingOffers: [
            { name: 'Premium Business Class Package', conversion: 85, revenue: 2450000 },
            { name: 'Economy Plus Group Rates', conversion: 62, revenue: 1780000 },
            { name: 'Executive First Class', conversion: 78, revenue: 1890000 }
        ],
        corporatePerformance: [
            { corporate: 'TechCorp International', usage: 85, conversion: 78, revenue: 2450000 },
            { corporate: 'Global Manufacturing Ltd', usage: 62, conversion: 65, revenue: 1780000 },
            { corporate: 'Sunrise Financial Services', usage: 45, conversion: 58, revenue: 1340000 }
        ]
    },
    predictions: {
        nextQuarter: {
            expectedRevenue: 3200000,
            expectedConversion: 82,
            confidence: 85,
            projectedBookings: 750
        },
        recommendations: [
            {
                id: 'rec-1',
                text: 'Increase discount for TechCorp by 2% to boost conversion from 78% to 85%',
                impact: '+$180K revenue',
                applied: false
            },
            {
                id: 'rec-2',
                text: 'Target healthcare sector with new route-based offers - potential 15% revenue increase',
                impact: '+$350K revenue',
                applied: false
            },
            {
                id: 'rec-3',
                text: 'Optimize validity periods for seasonal travel patterns - could improve usage by 12%',
                impact: '+8% usage',
                applied: false
            },
            {
                id: 'rec-4',
                text: 'Introduce weekend travel discounts for leisure corporate travel',
                impact: '+25% bookings',
                applied: false
            },
            {
                id: 'rec-5',
                text: 'Expand business class offerings to emerging markets',
                impact: '+$220K revenue',
                applied: false
            }
        ]
    }
};
// Mock order data
const mockOrders = [
    {
        id: 'ORD-001',
        corporate: 'TechCorp International',
        offer: 'Premium Business Class Package',
        status: 'Confirmed',
        value: 125000,
        date: '2024-01-15',
        passengers: 15,
        routes: ['SFO-LON', 'LON-SFO'],
        travelDates: ['2024-03-15', '2024-03-22'],
        contactPerson: 'Sarah Johnson',
        bookingReference: 'TC-2024-001',
        paymentStatus: 'Paid',
        specialRequests: 'Vegetarian meals for 3 passengers, wheelchair assistance for 1 passenger',
        appliedDiscounts: ['DISC-001'],
        promoCodes: ['PROMO-001']
    },
    {
        id: 'ORD-002',
        corporate: 'Global Manufacturing Ltd',
        offer: 'Economy Plus Group Rates',
        status: 'Processing',
        value: 89000,
        date: '2024-01-14',
        passengers: 25,
        routes: ['ORD-FRA', 'FRA-ORD'],
        travelDates: ['2024-02-20', '2024-02-27'],
        contactPerson: 'Mike Wilson',
        bookingReference: 'GM-2024-002',
        paymentStatus: 'Pending',
        specialRequests: 'Group seating arrangement, conference room booking at destination',
        appliedDiscounts: ['DISC-002'],
        promoCodes: ['PROMO-002']
    },
    {
        id: 'ORD-003',
        corporate: 'Sunrise Financial Services',
        offer: 'Financial Services Executive',
        status: 'Completed',
        value: 245000,
        date: '2024-01-13',
        passengers: 8,
        routes: ['JFK-HKG', 'HKG-JFK'],
        travelDates: ['2024-01-20', '2024-01-25'],
        contactPerson: 'David Chen',
        bookingReference: 'SF-2024-003',
        paymentStatus: 'Paid',
        specialRequests: 'Private lounge access, priority customs clearance, ground transportation',
        appliedDiscounts: ['DISC-001', 'DISC-004'],
        promoCodes: ['PROMO-003']
    }
];
export function OfferManagement({ initialTab = 'dashboard', initialFilters }) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [offers, setOffers] = useState(mockOffers);
    const [templates, setTemplates] = useState(mockTemplates);
    const [recommendations, setRecommendations] = useState(analyticsData.predictions.recommendations);
    const [filteredOffers, setFilteredOffers] = useState(mockOffers);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [corporateFilter, setCorporateFilter] = useState('');
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showCreateTemplateDialog, setShowCreateTemplateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [showOrderDialog, setShowOrderDialog] = useState(false);
    const [showSendDialog, setShowSendDialog] = useState(false);
    const [showAtpcoDialog, setShowAtpcoDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newOffer, setNewOffer] = useState({
        title: '',
        corporate: '',
        type: '',
        discount: 0,
        validFrom: '',
        validTo: '',
        routes: '',
        cabin: [],
        description: '',
        terms: '',
        minSpend: 0,
        maxDiscount: 0,
        contactPerson: '',
        contactEmail: '',
        appliedDiscounts: [],
        promoCodes: []
    });
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        description: '',
        category: '',
        discount: '',
        cabin: '',
        features: [],
        basePrice: 0,
        validityPeriod: ''
    });
    // Filter offers based on search and filters
    useEffect(() => {
        let filtered = offers;
        if (searchQuery) {
            filtered = filtered.filter(offer => offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                offer.corporate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                offer.id.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (statusFilter && statusFilter !== 'all') {
            filtered = filtered.filter(offer => offer.status === statusFilter);
        }
        if (corporateFilter && corporateFilter !== 'all') {
            filtered = filtered.filter(offer => offer.corporate === corporateFilter);
        }
        setFilteredOffers(filtered);
    }, [offers, searchQuery, statusFilter, corporateFilter]);
    const handleCreateOffer = () => {
        setNewOffer({
            title: '',
            corporate: '',
            type: '',
            discount: 0,
            validFrom: '',
            validTo: '',
            routes: '',
            cabin: [],
            description: '',
            terms: '',
            minSpend: 0,
            maxDiscount: 0,
            contactPerson: '',
            contactEmail: '',
            appliedDiscounts: [],
            promoCodes: []
        });
        setShowCreateDialog(true);
    };
    const handleCreateTemplate = () => {
        setNewTemplate({
            name: '',
            description: '',
            category: '',
            discount: '',
            cabin: '',
            features: [],
            basePrice: 0,
            validityPeriod: ''
        });
        setShowCreateTemplateDialog(true);
    };
    const handleEditOffer = (offer) => {
        setSelectedOffer(offer);
        setNewOffer({
            title: offer.title,
            corporate: offer.corporate,
            type: offer.type,
            discount: offer.discount,
            validFrom: offer.validFrom,
            validTo: offer.validTo,
            routes: offer.routes.join(', '),
            cabin: Array.isArray(offer.cabin) ? offer.cabin : [offer.cabin.toLowerCase()],
            description: offer.description,
            terms: offer.terms,
            minSpend: offer.minSpend,
            maxDiscount: offer.maxDiscount,
            contactPerson: offer.contactPerson,
            contactEmail: offer.contactEmail,
            appliedDiscounts: offer.appliedDiscounts || [],
            promoCodes: offer.promoCodes || []
        });
        setShowEditDialog(true);
    };
    const handleViewOffer = (offer) => {
        setSelectedOffer(offer);
        setShowViewDialog(true);
    };
    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowOrderDialog(true);
    };
    const handleDeleteOffer = (offerId) => {
        setOffers(prev => prev.filter(offer => offer.id !== offerId));
    };
    const handleSendOffer = (offer) => {
        setSelectedOffer(offer);
        setShowSendDialog(true);
    };
    const handleAtpcoFiling = (offer) => {
        setSelectedOffer(offer);
        setShowAtpcoDialog(true);
    };
    const handleUseTemplate = (template) => {
        setNewOffer({
            title: `${template.name} Offer`,
            corporate: '',
            type: template.category.toLowerCase(),
            discount: parseInt(template.discount.split('-')[0]),
            validFrom: '',
            validTo: '',
            routes: '',
            cabin: template.cabin === 'All Classes' ? ['economy', 'business', 'first'] : [template.cabin.toLowerCase().replace('/', '_')],
            description: template.description,
            terms: `Based on ${template.name} template. ${template.features.join(', ')}.`,
            minSpend: template.basePrice * 10,
            maxDiscount: parseInt(template.discount.split('-')[1].replace('%', '')),
            contactPerson: '',
            contactEmail: '',
            appliedDiscounts: [],
            promoCodes: []
        });
        setShowCreateDialog(true);
    };
    const handleSaveOffer = () => {
        const offerData = {
            ...newOffer,
            id: selectedOffer ? selectedOffer.id : `OFF-${String(offers.length + 1).padStart(3, '0')}`,
            status: selectedOffer ? selectedOffer.status : 'Draft',
            usage: selectedOffer ? selectedOffer.usage : 0,
            conversion: selectedOffer ? selectedOffer.conversion : 0,
            revenue: selectedOffer ? selectedOffer.revenue : 0,
            bookings: selectedOffer ? selectedOffer.bookings : 0,
            routes: newOffer.routes.split(',').map(route => route.trim()).filter(route => route),
            atpcoStatus: selectedOffer ? selectedOffer.atpcoStatus : 'Not Filed',
            atpcoReference: selectedOffer ? selectedOffer.atpcoReference : '',
            lastModified: new Date().toISOString().split('T')[0],
            template: selectedOffer ? selectedOffer.template : 'Custom',
            priority: selectedOffer ? selectedOffer.priority : 'Medium',
            approvalStatus: selectedOffer ? selectedOffer.approvalStatus : 'Pending Review',
            createdBy: selectedOffer ? selectedOffer.createdBy : 'Current User',
            lastEditedBy: 'Current User'
        };
        if (selectedOffer) {
            setOffers(prev => prev.map(offer => offer.id === selectedOffer.id ? offerData : offer));
            setShowEditDialog(false);
        }
        else {
            setOffers(prev => [...prev, offerData]);
            setShowCreateDialog(false);
        }
        setSelectedOffer(null);
        // Show success message
        console.log('Offer saved successfully:', offerData);
    };
    const handleSaveTemplate = () => {
        const templateData = {
            ...newTemplate,
            id: `TPL-${String(templates.length + 1).padStart(3, '0')}`,
            usage: 0
        };
        setTemplates(prev => [...prev, templateData]);
        setShowCreateTemplateDialog(false);
        // Show success message
        console.log('Template created successfully:', templateData);
    };
    const handleApplyRecommendation = (recommendationId) => {
        setRecommendations(prev => prev.map(rec => rec.id === recommendationId
            ? { ...rec, applied: true }
            : rec));
        // Show success message
        console.log(`Applied recommendation: ${recommendationId}`);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Draft': return 'bg-yellow-100 text-yellow-800';
            case 'Expired': return 'bg-red-100 text-red-800';
            case 'Pending': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getAtpcoStatusColor = (status) => {
        switch (status) {
            case 'Filed': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Not Filed': return 'bg-gray-100 text-gray-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const handleCabinChange = (cabin, checked) => {
        setNewOffer(prev => ({
            ...prev,
            cabin: checked
                ? [...prev.cabin, cabin]
                : prev.cabin.filter(c => c !== cabin)
        }));
    };
    const handleDiscountChange = (discountId, checked) => {
        setNewOffer(prev => ({
            ...prev,
            appliedDiscounts: checked
                ? [...prev.appliedDiscounts, discountId]
                : prev.appliedDiscounts.filter(d => d !== discountId)
        }));
    };
    const handlePromoCodeChange = (promoCodeId, checked) => {
        setNewOffer(prev => ({
            ...prev,
            promoCodes: checked
                ? [...prev.promoCodes, promoCodeId]
                : prev.promoCodes.filter(p => p !== promoCodeId)
        }));
    };
    const handleTemplateFeatureChange = (feature, checked) => {
        setNewTemplate(prev => ({
            ...prev,
            features: checked
                ? [...prev.features, feature]
                : prev.features.filter(f => f !== feature)
        }));
    };
    const renderPromoCodesAndDiscounts = (appliedDiscounts = [], promoCodes = []) => {
        return (_jsxs("div", { className: "flex flex-wrap gap-1", children: [appliedDiscounts.map(discountId => {
                    const discount = mockDiscounts.find(d => d.id === discountId);
                    return discount ? (_jsxs(Badge, { variant: "secondary", className: "text-xs", children: [_jsx(Percent, { className: "h-3 w-3 mr-1" }), discount.name] }, discountId)) : null;
                }), promoCodes.map(promoId => {
                    const promo = mockPromoCodes.find(p => p.id === promoId);
                    return promo ? (_jsxs(Badge, { variant: "outline", className: "text-xs", children: [_jsx(Tag, { className: "h-3 w-3 mr-1" }), promo.code] }, promoId)) : null;
                })] }));
    };
    return (_jsxs("div", { className: "space-y-6 p-5", children: [_jsx(Card, { style: { boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' } }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "space-y-6", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-6 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50", children: [_jsx(TabsTrigger, { value: "dashboard", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Dashboard" }), _jsx(TabsTrigger, { value: "create", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Create Offers" }), _jsx(TabsTrigger, { value: "manage", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Manage Offers" }), _jsx(TabsTrigger, { value: "insights", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Insights" }), _jsx(TabsTrigger, { value: "filing", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Offers Filing" }), _jsx(TabsTrigger, { value: "orders", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200", children: "Order Management" })] }), _jsxs(TabsContent, { value: "dashboard", className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(BarChart3, { className: "h-5 w-5" }), "Offers Dashboard"] }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" }), _jsx(Input, { placeholder: "Search offers...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })] }), _jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Status" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Status" }), _jsx(SelectItem, { value: "Active", children: "Active" }), _jsx(SelectItem, { value: "Draft", children: "Draft" }), _jsx(SelectItem, { value: "Expired", children: "Expired" })] })] }), _jsxs(Select, { value: corporateFilter, onValueChange: setCorporateFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Corporate" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Corporates" }), _jsx(SelectItem, { value: "TechCorp International", children: "TechCorp International" }), _jsx(SelectItem, { value: "Global Manufacturing Ltd", children: "Global Manufacturing Ltd" }), _jsx(SelectItem, { value: "Sunrise Financial Services", children: "Sunrise Financial Services" })] })] }), _jsxs(Button, { variant: "outline", children: [_jsx(Filter, { className: "h-4 w-4 mr-2" }), "More Filters"] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Total Offers" }), _jsx("p", { className: "text-2xl font-bold", children: analyticsData.overview.totalOffers })] }), _jsx("div", { className: "p-2 bg-blue-100 rounded-lg", children: _jsx(Target, { className: "h-6 w-6 text-blue-600" }) })] }), _jsxs("div", { className: "flex items-center gap-1 mt-2", children: [_jsx(TrendingUp, { className: "h-4 w-4 text-green-600" }), _jsx("span", { className: "text-sm text-green-600", children: "+12% from last month" })] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Total Revenue" }), _jsxs("p", { className: "text-2xl font-bold", children: ["$", (analyticsData.overview.totalRevenue / 1000000).toFixed(1), "M"] })] }), _jsx("div", { className: "p-2 bg-green-100 rounded-lg", children: _jsx(DollarSign, { className: "h-6 w-6 text-green-600" }) })] }), _jsxs("div", { className: "flex items-center gap-1 mt-2", children: [_jsx(TrendingUp, { className: "h-4 w-4 text-green-600" }), _jsx("span", { className: "text-sm text-green-600", children: "+18% from last month" })] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Avg Conversion" }), _jsxs("p", { className: "text-2xl font-bold", children: [analyticsData.overview.averageConversion, "%"] })] }), _jsx("div", { className: "p-2 bg-purple-100 rounded-lg", children: _jsx(Activity, { className: "h-6 w-6 text-purple-600" }) })] }), _jsxs("div", { className: "flex items-center gap-1 mt-2", children: [_jsx(TrendingUp, { className: "h-4 w-4 text-green-600" }), _jsx("span", { className: "text-sm text-green-600", children: "+5% from last month" })] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Total Bookings" }), _jsx("p", { className: "text-2xl font-bold", children: analyticsData.overview.totalBookings.toLocaleString() })] }), _jsx("div", { className: "p-2 bg-orange-100 rounded-lg", children: _jsx(Users, { className: "h-6 w-6 text-orange-600" }) })] }), _jsxs("div", { className: "flex items-center gap-1 mt-2", children: [_jsx(TrendingUp, { className: "h-4 w-4 text-green-600" }), _jsx("span", { className: "text-sm text-green-600", children: "+23% from last month" })] })] }) })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Recent Offers Performance" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: filteredOffers.slice(0, 5).map((offer) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-2 bg-blue-100 rounded-lg", children: _jsx(Target, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("h4", { children: offer.title }), _jsx("p", { className: "text-sm text-muted-foreground", children: offer.corporate }), (offer.appliedDiscounts?.length > 0 || offer.promoCodes?.length > 0) && (_jsx("div", { className: "mt-2", children: renderPromoCodesAndDiscounts(offer.appliedDiscounts, offer.promoCodes) }))] })] }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Usage" }), _jsxs("p", { children: [offer.usage, "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Conversion" }), _jsxs("p", { children: [offer.conversion, "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Revenue" }), _jsxs("p", { children: ["$", (offer.revenue / 1000000).toFixed(1), "M"] })] }), _jsx(Badge, { className: getStatusColor(offer.status), children: offer.status })] })] }, offer.id))) }) })] })] }), _jsx(TabsContent, { value: "create", className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Activity, { className: "h-5 w-5" }), "Active Offers"] }), _jsxs(Button, { onClick: handleCreateOffer, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Create New Offer"] })] }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: offers.filter(offer => offer.status === 'Active').map((offer) => (_jsxs("div", { className: "p-3 border rounded-lg hover:bg-gray-50", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-medium text-sm", children: offer.title }), _jsx(Badge, { className: getStatusColor(offer.status), children: offer.status })] }), _jsx("p", { className: "text-xs text-muted-foreground mb-2", children: offer.corporate }), _jsxs("div", { className: "flex justify-between text-xs mb-2", children: [_jsxs("span", { children: ["Usage: ", offer.usage, "%"] }), _jsxs("span", { children: ["Conversion: ", offer.conversion, "%"] }), _jsxs("span", { children: ["$", (offer.revenue / 1000000).toFixed(1), "M"] })] }), (offer.appliedDiscounts?.length > 0 || offer.promoCodes?.length > 0) && (_jsx("div", { className: "mb-2", children: renderPromoCodesAndDiscounts(offer.appliedDiscounts, offer.promoCodes) })), _jsxs("div", { className: "flex gap-1 mt-2", children: [_jsx(Button, { size: "sm", variant: "ghost", onClick: () => handleViewOffer(offer), children: _jsx(Eye, { className: "h-3 w-3" }) }), _jsx(Button, { size: "sm", variant: "ghost", onClick: () => handleEditOffer(offer), children: _jsx(Edit, { className: "h-3 w-3" }) })] })] }, offer.id))) }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FileText, { className: "h-5 w-5" }), "Offer Templates"] }), _jsxs(Button, { onClick: handleCreateTemplate, variant: "outline", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "New Template"] })] }), _jsx(CardDescription, { children: "Use pre-built templates to create offers quickly" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: templates.map((template) => (_jsxs("div", { className: "p-3 border rounded-lg hover:bg-gray-50", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-medium text-sm", children: template.name }), _jsx(Badge, { variant: "outline", children: template.category })] }), _jsx("p", { className: "text-xs text-muted-foreground mb-2", children: template.description }), _jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-2", children: [_jsxs("span", { children: ["Discount: ", template.discount] }), _jsxs("span", { children: ["Used: ", template.usage, "x"] })] }), _jsxs("div", { className: "flex flex-wrap gap-1 mb-2", children: [template.features.slice(0, 2).map((feature, index) => (_jsx(Badge, { variant: "secondary", className: "text-xs", children: feature }, index))), template.features.length > 2 && (_jsxs(Badge, { variant: "secondary", className: "text-xs", children: ["+", template.features.length - 2, " more"] }))] }), _jsx(Button, { size: "sm", className: "w-full", onClick: () => handleUseTemplate(template), children: "Use Template" })] }, template.id))) }) })] })] }) }), _jsx(TabsContent, { value: "manage", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Edit, { className: "h-5 w-5" }), "Manage Active Offers"] }), _jsxs(Button, { onClick: handleCreateOffer, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "New Offer"] })] }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" }), _jsx(Input, { placeholder: "Search offers...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })] }), _jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Status" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Status" }), _jsx(SelectItem, { value: "Active", children: "Active" }), _jsx(SelectItem, { value: "Draft", children: "Draft" }), _jsx(SelectItem, { value: "Expired", children: "Expired" })] })] }), _jsxs(Select, { value: corporateFilter, onValueChange: setCorporateFilter, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Corporate" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Corporates" }), _jsx(SelectItem, { value: "TechCorp International", children: "TechCorp International" }), _jsx(SelectItem, { value: "Global Manufacturing Ltd", children: "Global Manufacturing Ltd" }), _jsx(SelectItem, { value: "Sunrise Financial Services", children: "Sunrise Financial Services" })] })] }), _jsxs(Button, { variant: "outline", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Export"] })] }), _jsx("div", { className: "border rounded-lg", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Offer Details" }), _jsx(TableHead, { children: "Corporate" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Performance" }), _jsx(TableHead, { children: "Promo Codes & Discounts" }), _jsx(TableHead, { children: "Validity" }), _jsx(TableHead, { children: "Actions" })] }) }), _jsx(TableBody, { children: filteredOffers.map((offer) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: offer.title }), _jsx("p", { className: "text-sm text-muted-foreground", children: offer.id }), _jsxs("div", { className: "flex gap-1 mt-1", children: [_jsx(Badge, { variant: "outline", className: "text-xs", children: offer.type }), _jsx(Badge, { variant: "outline", className: "text-xs", children: offer.cabin })] })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Building2, { className: "h-4 w-4 text-gray-400" }), offer.corporate] }) }), _jsx(TableCell, { children: _jsx(Badge, { className: getStatusColor(offer.status), children: offer.status }) }), _jsx(TableCell, { children: _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Usage:" }), _jsxs("span", { children: [offer.usage, "%"] })] }), _jsx(Progress, { value: offer.usage, className: "h-2" }), _jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [_jsxs("span", { children: ["Conv: ", offer.conversion, "%"] }), _jsxs("span", { children: [offer.bookings, " bookings"] })] })] }) }), _jsx(TableCell, { children: renderPromoCodesAndDiscounts(offer.appliedDiscounts, offer.promoCodes) }), _jsx(TableCell, { children: _jsxs("div", { className: "text-sm", children: [_jsx("p", { children: offer.validFrom }), _jsxs("p", { className: "text-muted-foreground", children: ["to ", offer.validTo] })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex gap-1", children: [_jsx(Button, { size: "sm", variant: "ghost", onClick: () => handleViewOffer(offer), children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx(Button, { size: "sm", variant: "ghost", onClick: () => handleEditOffer(offer), children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { size: "sm", variant: "ghost", onClick: () => handleSendOffer(offer), children: _jsx(Send, { className: "h-4 w-4" }) }), _jsx(Button, { size: "sm", variant: "ghost", onClick: () => handleDeleteOffer(offer.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] }) })] }, offer.id))) })] }) })] })] }) }), _jsxs(TabsContent, { value: "insights", className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Brain, { className: "h-5 w-5" }), "Offer Analytics & Insights"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" }), _jsx(Input, { placeholder: "Search analytics...", className: "pl-10" })] }), _jsxs(Select, { children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Time Period" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "7d", children: "Last 7 Days" }), _jsx(SelectItem, { value: "30d", children: "Last 30 Days" }), _jsx(SelectItem, { value: "90d", children: "Last 90 Days" }), _jsx(SelectItem, { value: "1y", children: "Last Year" })] })] }), _jsxs(Select, { children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Corporate" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Corporates" }), _jsx(SelectItem, { value: "techcorp", children: "TechCorp International" }), _jsx(SelectItem, { value: "globalmanuf", children: "Global Manufacturing Ltd" }), _jsx(SelectItem, { value: "sunrise", children: "Sunrise Financial Services" })] })] }), _jsxs(Button, { variant: "outline", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Refresh Data"] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(LineChart, { className: "h-5 w-5" }), "Conversion & Revenue Trends"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: analyticsData.performance.conversionTrend.map((data, index) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-8 bg-blue-100 rounded flex items-center justify-center", children: _jsx("span", { className: "text-xs font-medium text-blue-600", children: data.month }) }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm font-medium", children: ["Conversion: ", data.conversion, "%"] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Bookings: ", data.bookings] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-sm font-medium", children: ["$", (data.revenue / 1000000).toFixed(1), "M"] }), _jsxs("div", { className: "flex items-center gap-1", children: [index > 0 && data.revenue > analyticsData.performance.conversionTrend[index - 1].revenue ? (_jsx(TrendingUp, { className: "h-3 w-3 text-green-500" })) : index > 0 ? (_jsx(TrendingDown, { className: "h-3 w-3 text-red-500" })) : null, _jsx("span", { className: "text-xs text-muted-foreground", children: "Revenue" })] })] })] }, index))) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Award, { className: "h-5 w-5" }), "Top Performing Offers"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: analyticsData.performance.topPerformingOffers.map((offer, index) => (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center", children: _jsxs("span", { className: "text-sm font-medium text-orange-600", children: ["#", index + 1] }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: offer.name }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Conversion: ", offer.conversion, "%"] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-sm font-medium", children: ["$", (offer.revenue / 1000000).toFixed(1), "M"] }), _jsx(Progress, { value: offer.conversion, className: "h-2 w-16 mt-1" })] })] }, index))) }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Sparkles, { className: "h-5 w-5" }), "AI Predictions & Forecasts"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-medium", children: "Next Quarter Forecast" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center p-3 bg-blue-50 rounded-lg", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Expected Revenue:" }), _jsxs("span", { className: "font-medium text-blue-600", children: ["$", (analyticsData.predictions.nextQuarter.expectedRevenue / 1000000).toFixed(1), "M"] })] }), _jsxs("div", { className: "flex justify-between items-center p-3 bg-green-50 rounded-lg", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Expected Conversion:" }), _jsxs("span", { className: "font-medium text-green-600", children: [analyticsData.predictions.nextQuarter.expectedConversion, "%"] })] }), _jsxs("div", { className: "flex justify-between items-center p-3 bg-purple-50 rounded-lg", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Projected Bookings:" }), _jsx("span", { className: "font-medium text-purple-600", children: analyticsData.predictions.nextQuarter.projectedBookings })] }), _jsxs("div", { className: "flex justify-between items-center p-3 bg-orange-50 rounded-lg", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Confidence Level:" }), _jsxs("span", { className: "font-medium text-orange-600", children: [analyticsData.predictions.nextQuarter.confidence, "%"] })] })] })] }), _jsxs("div", { className: "lg:col-span-2", children: [_jsx("h4", { className: "font-medium mb-4", children: "AI Recommendations" }), _jsx("div", { className: "space-y-3", children: recommendations.map((rec, index) => (_jsxs(Alert, { className: `border-l-4 ${rec.applied ? 'border-l-green-500 bg-green-50' : 'border-l-blue-500'}`, children: [_jsx(Zap, { className: "h-4 w-4" }), _jsxs(AlertDescription, { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("span", { className: "text-sm", children: rec.text }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx(Badge, { variant: "outline", className: "text-xs", children: rec.impact }), rec.applied && (_jsx(Badge, { variant: "default", className: "text-xs bg-green-100 text-green-800", children: "Applied" }))] })] }), _jsx(Button, { size: "sm", variant: rec.applied ? "secondary" : "outline", className: "ml-4", onClick: () => handleApplyRecommendation(rec.id), disabled: rec.applied, children: rec.applied ? 'Applied' : 'Apply' })] })] }, index))) })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Corporate Usage Analytics" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: analyticsData.performance.corporatePerformance.map((corp, index) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-2 bg-blue-100 rounded-lg", children: _jsx(Building2, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: corp.corporate }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Performance Metrics" })] })] }), _jsxs("div", { className: "flex items-center gap-8", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Usage Rate" }), _jsxs("p", { className: "text-lg font-medium", children: [corp.usage, "%"] }), _jsx(Progress, { value: corp.usage, className: "h-2 w-16 mt-1" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Success Rate" }), _jsxs("p", { className: "text-lg font-medium", children: [corp.conversion, "%"] }), _jsx(Progress, { value: corp.conversion, className: "h-2 w-16 mt-1" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Revenue" }), _jsxs("p", { className: "text-lg font-medium", children: ["$", (corp.revenue / 1000000).toFixed(1), "M"] }), _jsxs("div", { className: "flex items-center gap-1 mt-1", children: [_jsx(TrendingUp, { className: "h-3 w-3 text-green-500" }), _jsx("span", { className: "text-xs text-green-500", children: "+15%" })] })] })] })] }, index))) }) })] })] }), _jsxs(TabsContent, { value: "filing", className: "space-y-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Database, { className: "h-5 w-5" }), "ATPCO Filing Management"] }), _jsx(CardDescription, { children: "Manage ATPCO filings for your offers with real-time status tracking" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsxs(Button, { children: [_jsx(Upload, { className: "h-4 w-4 mr-2" }), "Bulk File to ATPCO"] }), _jsxs(Select, { children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Filing Status" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Status" }), _jsx(SelectItem, { value: "Filed", children: "Filed" }), _jsx(SelectItem, { value: "Pending", children: "Pending" }), _jsx(SelectItem, { value: "Not Filed", children: "Not Filed" }), _jsx(SelectItem, { value: "Rejected", children: "Rejected" })] })] }), _jsxs(Select, { children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Priority" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Priorities" }), _jsx(SelectItem, { value: "High", children: "High" }), _jsx(SelectItem, { value: "Medium", children: "Medium" }), _jsx(SelectItem, { value: "Low", children: "Low" })] })] }), _jsxs(Button, { variant: "outline", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Sync Status"] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Offer Filing Status" }) }), _jsx(CardContent, { children: _jsx("div", { className: "border rounded-lg", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Offer Details" }), _jsx(TableHead, { children: "Corporate" }), _jsx(TableHead, { children: "ATPCO Status" }), _jsx(TableHead, { children: "Promo Codes & Discounts" }), _jsx(TableHead, { children: "Reference" }), _jsx(TableHead, { children: "Last Updated" }), _jsx(TableHead, { children: "Priority" }), _jsx(TableHead, { children: "Actions" })] }) }), _jsx(TableBody, { children: offers.map((offer) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: offer.title }), _jsx("p", { className: "text-sm text-muted-foreground", children: offer.id })] }) }), _jsx(TableCell, { children: offer.corporate }), _jsx(TableCell, { children: _jsx(Badge, { className: getAtpcoStatusColor(offer.atpcoStatus), children: offer.atpcoStatus }) }), _jsx(TableCell, { children: renderPromoCodesAndDiscounts(offer.appliedDiscounts, offer.promoCodes) }), _jsx(TableCell, { children: _jsx("div", { className: "flex items-center gap-2", children: offer.atpcoReference ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "font-mono text-sm", children: offer.atpcoReference }), _jsx(Button, { size: "sm", variant: "ghost", children: _jsx(Copy, { className: "h-4 w-4" }) })] })) : (_jsx("span", { className: "text-muted-foreground", children: "-" })) }) }), _jsx(TableCell, { children: _jsx("div", { className: "text-sm", children: _jsx("p", { children: offer.lastModified }) }) }), _jsx(TableCell, { children: _jsx(Badge, { variant: offer.priority === 'High' ? 'destructive' : offer.priority === 'Medium' ? 'default' : 'secondary', children: offer.priority }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex gap-1", children: [_jsx(Button, { size: "sm", variant: "ghost", onClick: () => handleViewOffer(offer), children: _jsx(Eye, { className: "h-4 w-4" }) }), offer.atpcoStatus === 'Not Filed' && (_jsxs(Button, { size: "sm", onClick: () => handleAtpcoFiling(offer), children: [_jsx(Upload, { className: "h-4 w-4 mr-1" }), "File"] })), offer.atpcoStatus === 'Filed' && (_jsxs(Button, { size: "sm", variant: "outline", children: [_jsx(ExternalLink, { className: "h-4 w-4 mr-1" }), "View"] })), _jsx(Button, { size: "sm", variant: "ghost", children: _jsx(RefreshCw, { className: "h-4 w-4" }) })] }) })] }, offer.id))) })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Server, { className: "h-5 w-5" }), "ATPCO Integration Status"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-green-500" }), _jsx("span", { className: "font-medium", children: "Connection Status" })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Connected to ATPCO" }), _jsx("p", { className: "text-xs text-green-600", children: "Last sync: 2 minutes ago" })] }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Activity, { className: "h-4 w-4 text-blue-600" }), _jsx("span", { className: "font-medium", children: "Filing Queue" })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "3 offers pending" }), _jsx("p", { className: "text-xs text-blue-600", children: "Est. processing: 15 min" })] }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Shield, { className: "h-4 w-4 text-purple-600" }), _jsx("span", { className: "font-medium", children: "Compliance" })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "All filings compliant" }), _jsx("p", { className: "text-xs text-purple-600", children: "Last audit: Passed" })] })] }) })] })] }), _jsx(TabsContent, { value: "orders", className: "space-y-6", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(ShoppingCart, { className: "h-5 w-5" }), "Order Management"] }), _jsx(CardDescription, { children: "Track and manage orders from accepted offers" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" }), _jsx(Input, { placeholder: "Search orders...", className: "pl-10" })] }), _jsxs(Select, { children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Order Status" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Status" }), _jsx(SelectItem, { value: "Confirmed", children: "Confirmed" }), _jsx(SelectItem, { value: "Processing", children: "Processing" }), _jsx(SelectItem, { value: "Completed", children: "Completed" }), _jsx(SelectItem, { value: "Cancelled", children: "Cancelled" })] })] }), _jsxs(Select, { children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Corporate" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Corporates" }), _jsx(SelectItem, { value: "techcorp", children: "TechCorp International" }), _jsx(SelectItem, { value: "globalmanuf", children: "Global Manufacturing Ltd" }), _jsx(SelectItem, { value: "sunrise", children: "Sunrise Financial Services" })] })] }), _jsxs(Button, { variant: "outline", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Export Orders"] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Total Orders" }), _jsx("p", { className: "text-2xl font-bold", children: "1,247" })] }), _jsx(ShoppingCart, { className: "h-8 w-8 text-blue-500" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Active Orders" }), _jsx("p", { className: "text-2xl font-bold", children: "89" })] }), _jsx(Activity, { className: "h-8 w-8 text-green-500" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Order Value" }), _jsx("p", { className: "text-2xl font-bold", children: "$8.9M" })] }), _jsx(DollarSign, { className: "h-8 w-8 text-purple-500" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Avg Order Size" }), _jsx("p", { className: "text-2xl font-bold", children: "$7.1K" })] }), _jsx(TrendingUp, { className: "h-8 w-8 text-orange-500" })] }) }) })] }), _jsx("div", { className: "border rounded-lg", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Order ID" }), _jsx(TableHead, { children: "Corporate" }), _jsx(TableHead, { children: "Offer" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Promo Codes & Discounts" }), _jsx(TableHead, { children: "Value" }), _jsx(TableHead, { children: "Date" }), _jsx(TableHead, { children: "Actions" })] }) }), _jsx(TableBody, { children: mockOrders.map((order) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-mono", children: order.id }), _jsx(TableCell, { children: order.corporate }), _jsx(TableCell, { children: order.offer }), _jsx(TableCell, { children: _jsx(Badge, { className: order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                                                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                                                order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                                                    'bg-red-100 text-red-800', children: order.status }) }), _jsx(TableCell, { children: renderPromoCodesAndDiscounts(order.appliedDiscounts, order.promoCodes) }), _jsxs(TableCell, { children: ["$", order.value.toLocaleString()] }), _jsx(TableCell, { children: order.date }), _jsx(TableCell, { children: _jsxs("div", { className: "flex gap-1", children: [_jsx(Button, { size: "sm", variant: "ghost", onClick: () => handleViewOrder(order), children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx(Button, { size: "sm", variant: "ghost", onClick: () => handleViewOrder(order), children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { size: "sm", variant: "ghost", children: _jsx(Download, { className: "h-4 w-4" }) })] }) })] }, order.id))) })] }) })] })] }) })] }), _jsx(Dialog, { open: showCreateDialog, onOpenChange: setShowCreateDialog, children: _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Create New Travel Offer" }), _jsx(DialogDescription, { children: "Create a comprehensive travel offer with detailed terms and conditions" })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Offer Title *" }), _jsx(Input, { placeholder: "Enter descriptive offer title", value: newOffer.title, onChange: (e) => setNewOffer({ ...newOffer, title: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Corporate Client *" }), _jsxs(Select, { value: newOffer.corporate, onValueChange: (value) => setNewOffer({ ...newOffer, corporate: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select corporate client" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "TechCorp International", children: "TechCorp International" }), _jsx(SelectItem, { value: "Global Manufacturing Ltd", children: "Global Manufacturing Ltd" }), _jsx(SelectItem, { value: "Sunrise Financial Services", children: "Sunrise Financial Services" }), _jsx(SelectItem, { value: "Healthcare Plus Inc", children: "Healthcare Plus Inc" }), _jsx(SelectItem, { value: "Energy Solutions Corp", children: "Energy Solutions Corp" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Offer Type *" }), _jsxs(Select, { value: newOffer.type, onValueChange: (value) => setNewOffer({ ...newOffer, type: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select offer type" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "route-based", children: "Route-based" }), _jsx(SelectItem, { value: "volume-based", children: "Volume-based" }), _jsx(SelectItem, { value: "flexible", children: "Flexible" }), _jsx(SelectItem, { value: "seasonal", children: "Seasonal" }), _jsx(SelectItem, { value: "corporate-rate", children: "Corporate Rate" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Discount Percentage *" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { type: "number", placeholder: "0", value: newOffer.discount, onChange: (e) => setNewOffer({ ...newOffer, discount: parseInt(e.target.value) || 0 }) }), _jsx(Percent, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600 mb-3 block", children: "Apply Discounts" }), _jsx("div", { className: "border rounded-lg p-4 max-h-48 overflow-y-auto", children: mockDiscounts.filter(d => d.status === 'Active').map((discount) => (_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(Checkbox, { id: `discount-${discount.id}`, checked: newOffer.appliedDiscounts.includes(discount.id), onCheckedChange: (checked) => handleDiscountChange(discount.id, checked) }), _jsxs(Label, { htmlFor: `discount-${discount.id}`, className: "text-sm flex-1", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: discount.name }), _jsxs("span", { className: "text-muted-foreground ml-2", children: ["(", discount.type === 'Percentage' ? `${discount.value}%` : `$${discount.value}`, ")"] })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: discount.description })] })] }, discount.id))) })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600 mb-3 block", children: "Apply Promo Codes" }), _jsx("div", { className: "border rounded-lg p-4 max-h-48 overflow-y-auto", children: mockPromoCodes.filter(p => p.status === 'Active').map((promo) => (_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(Checkbox, { id: `promo-${promo.id}`, checked: newOffer.promoCodes.includes(promo.id), onCheckedChange: (checked) => handlePromoCodeChange(promo.id, checked) }), _jsxs(Label, { htmlFor: `promo-${promo.id}`, className: "text-sm flex-1", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium font-mono text-blue-600", children: promo.code }), _jsxs("span", { className: "text-muted-foreground ml-2", children: ["(", promo.type === 'Percentage' ? `${promo.value}%` : `$${promo.value}`, ")"] })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: promo.description })] })] }, promo.id))) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Valid From *" }), _jsx(Input, { type: "date", value: newOffer.validFrom, onChange: (e) => setNewOffer({ ...newOffer, validFrom: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Valid Until *" }), _jsx(Input, { type: "date", value: newOffer.validTo, onChange: (e) => setNewOffer({ ...newOffer, validTo: e.target.value }) })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Routes *" }), _jsx(Textarea, { placeholder: "Enter routes (e.g., NYC-LON, SFO-FRA, LAX-NRT)", value: newOffer.routes, onChange: (e) => setNewOffer({ ...newOffer, routes: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Cabin Class *" }), _jsxs("div", { className: "flex gap-4 mt-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "economy", checked: newOffer.cabin.includes('economy'), onCheckedChange: (checked) => handleCabinChange('economy', checked) }), _jsx(Label, { htmlFor: "economy", children: "Economy" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "business", checked: newOffer.cabin.includes('business'), onCheckedChange: (checked) => handleCabinChange('business', checked) }), _jsx(Label, { htmlFor: "business", children: "Business" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "first", checked: newOffer.cabin.includes('first'), onCheckedChange: (checked) => handleCabinChange('first', checked) }), _jsx(Label, { htmlFor: "first", children: "First" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Minimum Spend (USD)" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { type: "number", placeholder: "0", value: newOffer.minSpend, onChange: (e) => setNewOffer({ ...newOffer, minSpend: parseInt(e.target.value) || 0 }) }), _jsx(DollarSign, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Maximum Discount (%)" }), _jsx(Input, { type: "number", placeholder: "0", value: newOffer.maxDiscount, onChange: (e) => setNewOffer({ ...newOffer, maxDiscount: parseInt(e.target.value) || 0 }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Contact Person" }), _jsx(Input, { placeholder: "Primary contact name", value: newOffer.contactPerson, onChange: (e) => setNewOffer({ ...newOffer, contactPerson: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Contact Email" }), _jsx(Input, { type: "email", placeholder: "contact@company.com", value: newOffer.contactEmail, onChange: (e) => setNewOffer({ ...newOffer, contactEmail: e.target.value }) })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Offer Description *" }), _jsx(Textarea, { placeholder: "Detailed description of the offer, its benefits, and target audience", rows: 3, value: newOffer.description, onChange: (e) => setNewOffer({ ...newOffer, description: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Terms & Conditions *" }), _jsx(Textarea, { placeholder: "Enter detailed terms and conditions, restrictions, booking requirements, etc.", rows: 4, value: newOffer.terms, onChange: (e) => setNewOffer({ ...newOffer, terms: e.target.value }) })] })] })] }), _jsxs(DialogFooter, { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => setShowCreateDialog(false), children: "Cancel" }), _jsx(Button, { variant: "outline", onClick: handleSaveOffer, children: "Save as Draft" }), _jsxs(Button, { onClick: handleSaveOffer, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Create Offer"] })] })] }) }), _jsx(Dialog, { open: showEditDialog, onOpenChange: setShowEditDialog, children: _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Edit Travel Offer" }), _jsx(DialogDescription, { children: "Update the travel offer details" })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Offer Title *" }), _jsx(Input, { placeholder: "Enter descriptive offer title", value: newOffer.title, onChange: (e) => setNewOffer({ ...newOffer, title: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Corporate Client *" }), _jsxs(Select, { value: newOffer.corporate, onValueChange: (value) => setNewOffer({ ...newOffer, corporate: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select corporate client" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "TechCorp International", children: "TechCorp International" }), _jsx(SelectItem, { value: "Global Manufacturing Ltd", children: "Global Manufacturing Ltd" }), _jsx(SelectItem, { value: "Sunrise Financial Services", children: "Sunrise Financial Services" }), _jsx(SelectItem, { value: "Healthcare Plus Inc", children: "Healthcare Plus Inc" }), _jsx(SelectItem, { value: "Energy Solutions Corp", children: "Energy Solutions Corp" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600 mb-3 block", children: "Applied Discounts" }), _jsx("div", { className: "border rounded-lg p-4 max-h-48 overflow-y-auto", children: mockDiscounts.filter(d => d.status === 'Active').map((discount) => (_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(Checkbox, { id: `edit-discount-${discount.id}`, checked: newOffer.appliedDiscounts.includes(discount.id), onCheckedChange: (checked) => handleDiscountChange(discount.id, checked) }), _jsxs(Label, { htmlFor: `edit-discount-${discount.id}`, className: "text-sm flex-1", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: discount.name }), _jsxs("span", { className: "text-muted-foreground ml-2", children: ["(", discount.type === 'Percentage' ? `${discount.value}%` : `$${discount.value}`, ")"] })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: discount.description })] })] }, discount.id))) })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600 mb-3 block", children: "Applied Promo Codes" }), _jsx("div", { className: "border rounded-lg p-4 max-h-48 overflow-y-auto", children: mockPromoCodes.filter(p => p.status === 'Active').map((promo) => (_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(Checkbox, { id: `edit-promo-${promo.id}`, checked: newOffer.promoCodes.includes(promo.id), onCheckedChange: (checked) => handlePromoCodeChange(promo.id, checked) }), _jsxs(Label, { htmlFor: `edit-promo-${promo.id}`, className: "text-sm flex-1", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium font-mono text-blue-600", children: promo.code }), _jsxs("span", { className: "text-muted-foreground ml-2", children: ["(", promo.type === 'Percentage' ? `${promo.value}%` : `$${promo.value}`, ")"] })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: promo.description })] })] }, promo.id))) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Valid From *" }), _jsx(Input, { type: "date", value: newOffer.validFrom, onChange: (e) => setNewOffer({ ...newOffer, validFrom: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Valid Until *" }), _jsx(Input, { type: "date", value: newOffer.validTo, onChange: (e) => setNewOffer({ ...newOffer, validTo: e.target.value }) })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Offer Description *" }), _jsx(Textarea, { placeholder: "Detailed description of the offer, its benefits, and target audience", rows: 3, value: newOffer.description, onChange: (e) => setNewOffer({ ...newOffer, description: e.target.value }) })] })] }), _jsxs(DialogFooter, { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => setShowEditDialog(false), children: "Cancel" }), _jsxs(Button, { onClick: handleSaveOffer, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Save Changes"] })] })] }) }), _jsx(Dialog, { open: showCreateTemplateDialog, onOpenChange: setShowCreateTemplateDialog, children: _jsxs(DialogContent, { className: "max-w-3xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Create New Template" }), _jsx(DialogDescription, { children: "Create a reusable template for offer creation" })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Template Name *" }), _jsx(Input, { placeholder: "Enter template name", value: newTemplate.name, onChange: (e) => setNewTemplate({ ...newTemplate, name: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Category *" }), _jsxs(Select, { value: newTemplate.category, onValueChange: (value) => setNewTemplate({ ...newTemplate, category: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select category" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Premium", children: "Premium" }), _jsx(SelectItem, { value: "Volume", children: "Volume" }), _jsx(SelectItem, { value: "Executive", children: "Executive" }), _jsx(SelectItem, { value: "SME", children: "SME" }), _jsx(SelectItem, { value: "Seasonal", children: "Seasonal" })] })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Description *" }), _jsx(Textarea, { placeholder: "Describe the template and its intended use", value: newTemplate.description, onChange: (e) => setNewTemplate({ ...newTemplate, description: e.target.value }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Discount Range" }), _jsx(Input, { placeholder: "e.g., 10-20%", value: newTemplate.discount, onChange: (e) => setNewTemplate({ ...newTemplate, discount: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Cabin Class" }), _jsxs(Select, { value: newTemplate.cabin, onValueChange: (value) => setNewTemplate({ ...newTemplate, cabin: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select cabin" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Economy", children: "Economy" }), _jsx(SelectItem, { value: "Economy Plus", children: "Economy Plus" }), _jsx(SelectItem, { value: "Business", children: "Business" }), _jsx(SelectItem, { value: "First", children: "First" }), _jsx(SelectItem, { value: "Business/First", children: "Business/First" }), _jsx(SelectItem, { value: "All Classes", children: "All Classes" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Base Price (USD)" }), _jsx(Input, { type: "number", placeholder: "0", value: newTemplate.basePrice, onChange: (e) => setNewTemplate({ ...newTemplate, basePrice: parseInt(e.target.value) || 0 }) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Validity Period" }), _jsxs(Select, { value: newTemplate.validityPeriod, onValueChange: (value) => setNewTemplate({ ...newTemplate, validityPeriod: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select period" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "3 months", children: "3 months" }), _jsx(SelectItem, { value: "6 months", children: "6 months" }), _jsx(SelectItem, { value: "9 months", children: "9 months" }), _jsx(SelectItem, { value: "12 months", children: "12 months" }), _jsx(SelectItem, { value: "18 months", children: "18 months" }), _jsx(SelectItem, { value: "24 months", children: "24 months" })] })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Template Features" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3 mt-2", children: ['Lounge Access', 'Priority Boarding', 'Flexible Changes', 'Premium Seats', 'Group Discounts', 'Flexible Dates', 'Free Seat Selection', 'Bulk Booking', 'Concierge Service', 'Private Transfers', 'Hotel Partnerships', 'Unlimited Changes', 'Cost Effective', 'Online Management', 'Basic Amenities'].map((feature) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: `feature-${feature}`, checked: newTemplate.features.includes(feature), onCheckedChange: (checked) => handleTemplateFeatureChange(feature, checked) }), _jsx(Label, { htmlFor: `feature-${feature}`, className: "text-sm", children: feature })] }, feature))) })] })] }), _jsxs(DialogFooter, { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => setShowCreateTemplateDialog(false), children: "Cancel" }), _jsxs(Button, { onClick: handleSaveTemplate, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Create Template"] })] })] }) }), _jsx(Dialog, { open: showViewDialog, onOpenChange: setShowViewDialog, children: _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Offer Details" }), _jsx(DialogDescription, { children: "Complete information about the selected offer" })] }), selectedOffer && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold", children: selectedOffer.title }), _jsx("p", { className: "text-sm text-muted-foreground", children: selectedOffer.id })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Badge, { className: getStatusColor(selectedOffer.status), children: selectedOffer.status }), _jsx(Badge, { variant: "outline", children: selectedOffer.type })] })] }), (selectedOffer.appliedDiscounts?.length > 0 || selectedOffer.promoCodes?.length > 0) && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-base", children: "Applied Promotions" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [selectedOffer.appliedDiscounts?.length > 0 && (_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600 mb-2 block", children: "Applied Discounts" }), _jsx("div", { className: "space-y-2", children: selectedOffer.appliedDiscounts.map(discountId => {
                                                                    const discount = mockDiscounts.find(d => d.id === discountId);
                                                                    return discount ? (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Percent, { className: "h-4 w-4 text-blue-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: discount.name }), _jsx("p", { className: "text-xs text-muted-foreground", children: discount.description })] })] }), _jsx(Badge, { variant: "secondary", children: discount.type === 'Percentage' ? `${discount.value}%` : `$${discount.value}` })] }, discountId)) : null;
                                                                }) })] })), selectedOffer.promoCodes?.length > 0 && (_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600 mb-2 block", children: "Applied Promo Codes" }), _jsx("div", { className: "space-y-2", children: selectedOffer.promoCodes.map(promoId => {
                                                                    const promo = mockPromoCodes.find(p => p.id === promoId);
                                                                    return promo ? (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Tag, { className: "h-4 w-4 text-blue-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm font-mono text-blue-600", children: promo.code }), _jsx("p", { className: "text-xs text-muted-foreground", children: promo.description })] })] }), _jsx(Badge, { variant: "outline", children: promo.type === 'Percentage' ? `${promo.value}%` : `$${promo.value}` })] }, promoId)) : null;
                                                                }) })] }))] }) })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Corporate Client" }), _jsx("p", { children: selectedOffer.corporate })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Contact Person" }), _jsx("p", { children: selectedOffer.contactPerson })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Contact Email" }), _jsx("p", { children: selectedOffer.contactEmail })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Cabin Class" }), _jsx("p", { children: selectedOffer.cabin })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Discount" }), _jsxs("p", { children: [selectedOffer.discount, "%"] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Valid Period" }), _jsxs("p", { children: [selectedOffer.validFrom, " to ", selectedOffer.validTo] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Minimum Spend" }), _jsxs("p", { children: ["$", selectedOffer.minSpend?.toLocaleString()] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Maximum Discount" }), _jsxs("p", { children: [selectedOffer.maxDiscount, "%"] })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Routes" }), _jsx("div", { className: "flex flex-wrap gap-2 mt-1", children: selectedOffer.routes?.map((route, index) => (_jsx(Badge, { variant: "secondary", children: route }, index))) })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Description" }), _jsx("p", { className: "mt-1 p-3 bg-gray-50 rounded-lg", children: selectedOffer.description })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Terms & Conditions" }), _jsx("p", { className: "mt-1 p-3 bg-gray-50 rounded-lg", children: selectedOffer.terms })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600 mb-3 block", children: "Performance Metrics" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-3 border rounded-lg text-center", children: [_jsxs("p", { className: "text-2xl font-bold text-blue-600", children: [selectedOffer.usage, "%"] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Usage Rate" })] }), _jsxs("div", { className: "p-3 border rounded-lg text-center", children: [_jsxs("p", { className: "text-2xl font-bold text-green-600", children: [selectedOffer.conversion, "%"] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Conversion" })] }), _jsxs("div", { className: "p-3 border rounded-lg text-center", children: [_jsx("p", { className: "text-2xl font-bold text-purple-600", children: selectedOffer.bookings }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Bookings" })] }), _jsxs("div", { className: "p-3 border rounded-lg text-center", children: [_jsxs("p", { className: "text-2xl font-bold text-orange-600", children: ["$", (selectedOffer.revenue / 1000000).toFixed(1), "M"] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Revenue" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Created By:" }), _jsx("span", { className: "text-sm", children: selectedOffer.createdBy })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Last Modified:" }), _jsx("span", { className: "text-sm", children: selectedOffer.lastModified })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Approval Status:" }), _jsx(Badge, { variant: "outline", children: selectedOffer.approvalStatus })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Priority:" }), _jsx(Badge, { variant: selectedOffer.priority === 'High' ? 'destructive' : 'secondary', children: selectedOffer.priority })] })] })] })] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowViewDialog(false), children: "Close" }), selectedOffer && (_jsxs(Button, { onClick: () => {
                                        setShowViewDialog(false);
                                        handleEditOffer(selectedOffer);
                                    }, children: [_jsx(Edit, { className: "h-4 w-4 mr-2" }), "Edit Offer"] }))] })] }) }), _jsx(Dialog, { open: showOrderDialog, onOpenChange: setShowOrderDialog, children: _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Order Details" }), _jsx(DialogDescription, { children: "Complete information about the selected order" })] }), selectedOrder && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold", children: ["Order ", selectedOrder.id] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Booking Reference: ", selectedOrder.bookingReference] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Badge, { className: selectedOrder.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                                        selectedOrder.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                            selectedOrder.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800', children: selectedOrder.status }), _jsx(Badge, { variant: "outline", children: selectedOrder.paymentStatus })] })] }), (selectedOrder.appliedDiscounts?.length > 0 || selectedOrder.promoCodes?.length > 0) && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-base", children: "Applied Promotions in Order" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [selectedOrder.appliedDiscounts?.length > 0 && (_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600 mb-2 block", children: "Applied Discounts" }), _jsx("div", { className: "space-y-2", children: selectedOrder.appliedDiscounts.map(discountId => {
                                                                    const discount = mockDiscounts.find(d => d.id === discountId);
                                                                    return discount ? (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Percent, { className: "h-4 w-4 text-blue-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: discount.name }), _jsx("p", { className: "text-xs text-muted-foreground", children: discount.description })] })] }), _jsx(Badge, { variant: "secondary", children: discount.type === 'Percentage' ? `${discount.value}%` : `$${discount.value}` })] }, discountId)) : null;
                                                                }) })] })), selectedOrder.promoCodes?.length > 0 && (_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600 mb-2 block", children: "Applied Promo Codes" }), _jsx("div", { className: "space-y-2", children: selectedOrder.promoCodes.map(promoId => {
                                                                    const promo = mockPromoCodes.find(p => p.id === promoId);
                                                                    return promo ? (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Tag, { className: "h-4 w-4 text-blue-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm font-mono text-blue-600", children: promo.code }), _jsx("p", { className: "text-xs text-muted-foreground", children: promo.description })] })] }), _jsx(Badge, { variant: "outline", children: promo.type === 'Percentage' ? `${promo.value}%` : `$${promo.value}` })] }, promoId)) : null;
                                                                }) })] }))] }) })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Corporate Client" }), _jsx("p", { children: selectedOrder.corporate })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Contact Person" }), _jsx("p", { children: selectedOrder.contactPerson })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Order Date" }), _jsx("p", { children: selectedOrder.date })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Number of Passengers" }), _jsx("p", { children: selectedOrder.passengers })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Offer" }), _jsx("p", { children: selectedOrder.offer })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Order Value" }), _jsxs("p", { className: "text-lg font-bold", children: ["$", selectedOrder.value.toLocaleString()] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Payment Status" }), _jsx(Badge, { variant: selectedOrder.paymentStatus === 'Paid' ? 'default' : 'secondary', children: selectedOrder.paymentStatus })] })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600 mb-3 block", children: "Travel Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Routes" }), _jsx("div", { className: "flex flex-wrap gap-2 mt-1", children: selectedOrder.routes?.map((route, index) => (_jsx(Badge, { variant: "secondary", children: route }, index))) })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Travel Dates" }), _jsx("div", { className: "flex flex-wrap gap-2 mt-1", children: selectedOrder.travelDates?.map((date, index) => (_jsx(Badge, { variant: "outline", children: date }, index))) })] })] })] }), selectedOrder.specialRequests && (_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Special Requests" }), _jsx("p", { className: "mt-1 p-3 bg-gray-50 rounded-lg", children: selectedOrder.specialRequests })] })), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("h4", { className: "font-medium mb-3", children: "Order Summary" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Base Value:" }), _jsxs("span", { children: ["$", (selectedOrder.value * 0.9).toLocaleString()] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Taxes & Fees:" }), _jsxs("span", { children: ["$", (selectedOrder.value * 0.1).toLocaleString()] })] }), _jsx(Separator, {}), _jsxs("div", { className: "flex justify-between font-bold", children: [_jsx("span", { children: "Total Amount:" }), _jsxs("span", { children: ["$", selectedOrder.value.toLocaleString()] })] })] })] })] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowOrderDialog(false), children: "Close" }), _jsxs(Button, { variant: "outline", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Download Invoice"] }), _jsxs(Button, { children: [_jsx(Edit, { className: "h-4 w-4 mr-2" }), "Edit Order"] })] })] }) }), _jsx(Dialog, { open: showSendDialog, onOpenChange: setShowSendDialog, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Send Offer" }), _jsx(DialogDescription, { children: "Send this offer to the corporate client" })] }), selectedOffer && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("h4", { className: "font-medium", children: selectedOffer.title }), _jsx("p", { className: "text-sm text-muted-foreground", children: selectedOffer.corporate })] }), _jsxs("div", { children: [_jsx(Label, { children: "Recipient Email" }), _jsx(Input, { type: "email", defaultValue: selectedOffer.contactEmail })] }), _jsxs("div", { children: [_jsx(Label, { children: "Message" }), _jsx(Textarea, { placeholder: "Add a personal message..." })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "copy-sender" }), _jsx(Label, { htmlFor: "copy-sender", children: "Send copy to sender" })] })] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowSendDialog(false), children: "Cancel" }), _jsxs(Button, { onClick: () => setShowSendDialog(false), children: [_jsx(Send, { className: "h-4 w-4 mr-2" }), "Send Offer"] })] })] }) }), _jsx(Dialog, { open: showAtpcoDialog, onOpenChange: setShowAtpcoDialog, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "File Offer to ATPCO" }), _jsx(DialogDescription, { children: "Submit this offer to ATPCO for filing and distribution" })] }), selectedOffer && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("h4", { className: "font-medium", children: selectedOffer.title }), _jsx("p", { className: "text-sm text-muted-foreground", children: selectedOffer.corporate })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Filing Priority" }), _jsxs(Select, { defaultValue: "Medium", children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "High", children: "High Priority" }), _jsx(SelectItem, { value: "Medium", children: "Medium Priority" }), _jsx(SelectItem, { value: "Low", children: "Low Priority" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Effective Date" }), _jsx(Input, { type: "date", defaultValue: selectedOffer.validFrom })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Filing Notes" }), _jsx(Textarea, { placeholder: "Add any special filing instructions..." })] }), _jsxs(Alert, { children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: "This offer will be submitted to ATPCO for review and filing. Processing typically takes 2-4 hours." })] })] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowAtpcoDialog(false), children: "Cancel" }), _jsxs(Button, { onClick: () => setShowAtpcoDialog(false), children: [_jsx(Upload, { className: "h-4 w-4 mr-2" }), "Submit to ATPCO"] })] })] }) })] }));
}
