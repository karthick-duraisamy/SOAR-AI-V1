import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Settings as SettingsIcon, Users, Shield, Bell, Palette, Globe, Lock, Plus, Edit, Trash2, Eye, EyeOff, Save, RefreshCw, Database, Server, Monitor, CheckCircle, AlertTriangle, Info, LayoutDashboard, Search, FileText, Building2, Target, RotateCcw, Gift, ShoppingCart, Package, TrendingUp, Activity, Headphones, BarChart3, List } from 'lucide-react';
// Mock data for users
const users = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@soar-ai.com',
        role: 'Administrator',
        department: 'IT Operations',
        status: 'Active',
        lastLogin: '2024-06-16 09:30',
        permissions: ['Dashboard', 'COINHUB', 'CONTRAQ', 'Offer Management', 'Settings'],
        phone: '+1 (555) 123-4567',
        joinDate: '2023-01-15'
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@soar-ai.com',
        role: 'Contract Manager',
        department: 'Legal & Compliance',
        status: 'Active',
        lastLogin: '2024-06-16 08:45',
        permissions: ['Dashboard', 'CONTRAQ'],
        phone: '+1 (555) 234-5678',
        joinDate: '2023-03-20'
    },
    {
        id: 3,
        name: 'Mike Davis',
        email: 'mike.davis@soar-ai.com',
        role: 'Offer Manager',
        department: 'Sales & Marketing',
        status: 'Active',
        lastLogin: '2024-06-15 16:22',
        permissions: ['Dashboard', 'COINHUB', 'Offer Management'],
        phone: '+1 (555) 345-6789',
        joinDate: '2023-05-10'
    },
    {
        id: 4,
        name: 'Lisa Wong',
        email: 'lisa.wong@soar-ai.com',
        role: 'Analyst',
        department: 'Business Analytics',
        status: 'Inactive',
        lastLogin: '2024-06-10 14:15',
        permissions: ['Dashboard'],
        phone: '+1 (555) 456-7890',
        joinDate: '2023-08-05'
    }
];
// Mock data for roles
const roles = [
    {
        id: 1,
        name: 'Administrator',
        description: 'Full system access with user management capabilities',
        permissions: ['Dashboard', 'COINHUB', 'CONTRAQ', 'Offer Management', 'Settings', 'User Management'],
        userCount: 1,
        color: 'destructive'
    },
    {
        id: 2,
        name: 'Contract Manager',
        description: 'Contract oversight and breach monitoring access',
        permissions: ['Dashboard', 'CONTRAQ', 'Breach Monitoring'],
        userCount: 3,
        color: 'default'
    },
    {
        id: 3,
        name: 'Offer Manager',
        description: 'Offer creation and management capabilities',
        permissions: ['Dashboard', 'Offer Management', 'Create Offers', 'Active Offers'],
        userCount: 2,
        color: 'secondary'
    },
    {
        id: 4,
        name: 'Support Agent',
        description: 'Customer support and ticket management access',
        permissions: ['Dashboard', 'CONVOY', 'Support Dashboard', 'Ticket Management'],
        userCount: 5,
        color: 'secondary'
    },
    {
        id: 5,
        name: 'Analyst',
        description: 'Read-only access to dashboards and reports',
        permissions: ['Dashboard', 'Reports'],
        userCount: 4,
        color: 'outline'
    }
];
// Available screens configuration with hierarchical structure
const availableScreens = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        description: 'System overview and key metrics',
        icon: LayoutDashboard,
        type: 'single',
        category: 'Core',
        defaultEnabled: true,
        canDisable: false // Dashboard cannot be disabled
    },
    {
        id: 'coinhub',
        name: 'COINHUB',
        description: 'Corporate Intelligent Hub - Main vendor management module',
        icon: Building2,
        type: 'group',
        category: 'Primary Module',
        defaultEnabled: true,
        canDisable: true,
        children: [
            {
                id: 'vendor-search',
                name: 'Vendor Search',
                description: 'AI-powered vendor discovery and evaluation',
                icon: Search,
                type: 'single',
                category: 'COINHUB Sub-module',
                defaultEnabled: true,
                canDisable: true
            },
            {
                id: 'contracts',
                name: 'Contract Management',
                description: 'Contract lifecycle management with AI recommendations',
                icon: FileText,
                type: 'single',
                category: 'COINHUB Sub-module',
                defaultEnabled: true,
                canDisable: true
            }
        ]
    },
    {
        id: 'contraq',
        name: 'CONTRAQ',
        description: 'Corporate Oversight for Negotiated Tracking, Renewals, Analytics & Quality',
        icon: Shield,
        type: 'group',
        category: 'Primary Module',
        defaultEnabled: true,
        canDisable: true,
        children: [
            {
                id: 'breach-monitoring',
                name: 'Breach Monitoring',
                description: 'Contract breach tracking and risk assessment',
                icon: AlertTriangle,
                type: 'single',
                category: 'CONTRAQ Sub-module',
                defaultEnabled: true,
                canDisable: true
            }
        ]
    },
    {
        id: 'offer-management',
        name: 'Offer Management',
        description: 'Comprehensive offer and order management system for airlines',
        icon: Gift,
        type: 'group',
        category: 'Primary Module',
        defaultEnabled: true,
        canDisable: true,
        children: [
            {
                id: 'create-offers',
                name: 'Create Offers',
                description: 'Create new offers for travel agencies and corporates',
                icon: Plus,
                type: 'single',
                category: 'Offer Management Sub-module',
                defaultEnabled: true,
                canDisable: true
            },
            {
                id: 'active-offers',
                name: 'Active Offers',
                description: 'Monitor and manage all active offers',
                icon: Target,
                type: 'single',
                category: 'Offer Management Sub-module',
                defaultEnabled: true,
                canDisable: true
            },
            {
                id: 'order-management',
                name: 'Order Management',
                description: 'Track and fulfill orders from accepted offers',
                icon: ShoppingCart,
                type: 'single',
                category: 'Offer Management Sub-module',
                defaultEnabled: true,
                canDisable: true
            },
            {
                id: 'offer-templates',
                name: 'Offer Templates',
                description: 'Manage offer templates and presets',
                icon: Package,
                type: 'single',
                category: 'Offer Management Sub-module',
                defaultEnabled: true,
                canDisable: true
            },
            {
                id: 'offer-analytics',
                name: 'Offer Analytics',
                description: 'Analyze offer performance and success rates',
                icon: TrendingUp,
                type: 'single',
                category: 'Offer Management Sub-module',
                defaultEnabled: true,
                canDisable: true
            }
        ]
    },
    {
        id: 'convoy',
        name: 'CONVOY',
        description: 'CONnecting Voices Of Your passengers - Customer Support System',
        icon: Headphones,
        type: 'group',
        category: 'Primary Module',
        defaultEnabled: true,
        canDisable: true,
        children: [
            {
                id: 'support-dashboard',
                name: 'Support Dashboard',
                description: 'Customer support agent dashboard and analytics',
                icon: BarChart3,
                type: 'single',
                category: 'CONVOY Sub-module',
                defaultEnabled: true,
                canDisable: true
            },
            {
                id: 'admin-dashboard',
                name: 'Admin Dashboard',
                description: 'Comprehensive customer support administration and analytics',
                icon: Activity,
                type: 'single',
                category: 'CONVOY Sub-module',
                defaultEnabled: true,
                canDisable: true
            },
            {
                id: 'ticket-list',
                name: 'Ticket List',
                description: 'View and manage customer support tickets',
                icon: List,
                type: 'single',
                category: 'CONVOY Sub-module',
                defaultEnabled: true,
                canDisable: true
            },
            {
                id: 'ticket-kanban',
                name: 'Ticket Board',
                description: 'Drag and drop ticket status management',
                icon: Target,
                type: 'single',
                category: 'CONVOY Sub-module',
                defaultEnabled: true,
                canDisable: true
            },
            {
                id: 'ticket-details',
                name: 'Ticket Details',
                description: 'Detailed ticket view and conversation history',
                icon: Eye,
                type: 'single',
                category: 'CONVOY Sub-module',
                defaultEnabled: true,
                canDisable: true
            }
        ]
    },
    {
        id: 'settings',
        name: 'Settings',
        description: 'System administration and configuration',
        icon: SettingsIcon,
        type: 'single',
        category: 'Administration',
        defaultEnabled: true,
        canDisable: false // Settings cannot be disabled
    }
];
export function Settings({ onScreenVisibilityChange }) {
    const [activeTab, setActiveTab] = useState('screen-management');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [isCreatingRole, setIsCreatingRole] = useState(false);
    // Screen visibility state
    const [screenVisibility, setScreenVisibility] = useState(() => {
        // Initialize from localStorage or use defaults
        const saved = localStorage.getItem('soar-ai-screen-visibility');
        if (saved) {
            return JSON.parse(saved);
        }
        // Create default visibility state
        const defaultState = {};
        const processScreens = (screens) => {
            screens.forEach(screen => {
                defaultState[screen.id] = screen.defaultEnabled;
                if (screen.children) {
                    processScreens(screen.children);
                }
            });
        };
        processScreens(availableScreens);
        return defaultState;
    });
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'Analyst',
        department: '',
        phone: '',
        permissions: []
    });
    const [newRole, setNewRole] = useState({
        name: '',
        description: '',
        permissions: []
    });
    const [systemSettings, setSystemSettings] = useState({
        sessionTimeout: '30',
        passwordExpiry: '90',
        maxLoginAttempts: '3',
        dataRetention: '365',
        backupFrequency: 'daily',
        notifications: {
            email: true,
            browser: true,
            breach: true,
            renewal: true,
            offers: true,
            orders: true,
            support: true,
            system: false
        },
        theme: 'light',
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        timezone: 'UTC-5'
    });
    // Save screen visibility to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('soar-ai-screen-visibility', JSON.stringify(screenVisibility));
    }, [screenVisibility]);
    const handleScreenToggle = (screenId, enabled) => {
        const newVisibility = { ...screenVisibility, [screenId]: enabled };
        // If disabling a parent, disable all children
        const findScreen = (screens, id) => {
            for (const screen of screens) {
                if (screen.id === id)
                    return screen;
                if (screen.children) {
                    const found = findScreen(screen.children, id);
                    if (found)
                        return found;
                }
            }
            return null;
        };
        const screen = findScreen(availableScreens, screenId);
        if (screen && screen.children && !enabled) {
            // Disable all children when parent is disabled
            screen.children.forEach(child => {
                newVisibility[child.id] = false;
            });
        }
        setScreenVisibility(newVisibility);
        // Notify parent component about the change
        if (onScreenVisibilityChange) {
            onScreenVisibilityChange(screenId, enabled);
        }
    };
    const handleBulkToggle = (enabled) => {
        const newVisibility = { ...screenVisibility };
        const processScreens = (screens) => {
            screens.forEach(screen => {
                if (screen.canDisable) {
                    newVisibility[screen.id] = enabled;
                }
                if (screen.children) {
                    processScreens(screen.children);
                }
            });
        };
        processScreens(availableScreens);
        setScreenVisibility(newVisibility);
    };
    const handleResetToDefaults = () => {
        const defaultState = {};
        const processScreens = (screens) => {
            screens.forEach(screen => {
                defaultState[screen.id] = screen.defaultEnabled;
                if (screen.children) {
                    processScreens(screen.children);
                }
            });
        };
        processScreens(availableScreens);
        setScreenVisibility(defaultState);
    };
    const getEnabledCount = () => {
        return Object.values(screenVisibility).filter(Boolean).length;
    };
    const getTotalCount = () => {
        return Object.keys(screenVisibility).length;
    };
    const handleCreateUser = () => {
        console.log('Creating user:', newUser);
        setIsCreatingUser(false);
        setNewUser({ name: '', email: '', role: 'Analyst', department: '', phone: '', permissions: [] });
    };
    const handleCreateRole = () => {
        console.log('Creating role:', newRole);
        setIsCreatingRole(false);
        setNewRole({ name: '', description: '', permissions: [] });
    };
    const handlePermissionChange = (permission, checked, type) => {
        if (type === 'user') {
            setNewUser(prev => ({
                ...prev,
                permissions: checked
                    ? [...prev.permissions, permission]
                    : prev.permissions.filter(p => p !== permission)
            }));
        }
        else {
            setNewRole(prev => ({
                ...prev,
                permissions: checked
                    ? [...prev.permissions, permission]
                    : prev.permissions.filter(p => p !== permission)
            }));
        }
    };
    const getRoleColor = (role) => {
        switch (role) {
            case 'Administrator': return 'destructive';
            case 'Contract Manager': return 'default';
            case 'Offer Manager': return 'secondary';
            case 'Support Agent': return 'secondary';
            case 'Analyst': return 'outline';
            default: return 'outline';
        }
    };
    const getStatusColor = (status) => {
        return status === 'Active' ? 'default' : 'secondary';
    };
    const handleSaveSettings = () => {
        console.log('Saving settings:', systemSettings);
        // Here you would typically save to your backend
    };
    const renderScreenItem = (screen, level = 0) => {
        const Icon = screen.icon;
        const isEnabled = screenVisibility[screen.id];
        const isDisabled = !screen.canDisable;
        return (_jsxs("div", { className: `${level > 0 ? 'ml-6 border-l border-border pl-4' : ''}`, children: [_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Icon, { className: "h-5 w-5 text-muted-foreground" }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "font-medium", children: screen.name }), _jsx(Badge, { variant: "outline", className: "text-xs", children: screen.category }), !screen.canDisable && (_jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" }))] }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: screen.description }), screen.type === 'group' && screen.children && (_jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: ["Contains ", screen.children.length, " sub-module", screen.children.length > 1 ? 's' : ''] }))] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: isEnabled ? 'Enabled' : 'Disabled' }), _jsx(Switch, { checked: isEnabled, onCheckedChange: (checked) => handleScreenToggle(screen.id, checked), disabled: isDisabled })] })] }), screen.children && isEnabled && (_jsx("div", { className: "mt-2 space-y-2", children: screen.children.map(child => renderScreenItem(child, level + 1)) }))] }, screen.id));
    };
    return (_jsxs("div", { className: "space-y-6 p-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold", children: "System Settings" }), _jsx("p", { className: "text-muted-foreground", children: "Manage users, permissions, screen visibility, and system configuration" })] }), _jsxs(Button, { onClick: handleSaveSettings, className: "flex items-center gap-2", children: [_jsx(Save, { className: "h-4 w-4" }), "Save All Changes"] })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-6 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50", children: [_jsxs(TabsTrigger, { value: "users", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 flex items-center gap-2", children: [_jsx(Users, { className: "h-4 w-4" }), "Users"] }), _jsxs(TabsTrigger, { value: "roles", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 flex items-center gap-2", children: [_jsx(Shield, { className: "h-4 w-4" }), "Roles & Access"] }), _jsxs(TabsTrigger, { value: "screen-management", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 flex items-center gap-2", children: [_jsx(Monitor, { className: "h-4 w-4" }), "Screen Management"] }), _jsxs(TabsTrigger, { value: "security", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 flex items-center gap-2", children: [_jsx(Lock, { className: "h-4 w-4" }), "Security"] }), _jsxs(TabsTrigger, { value: "system", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 flex items-center gap-2", children: [_jsx(Server, { className: "h-4 w-4" }), "System"] }), _jsxs(TabsTrigger, { value: "preferences", className: "rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-[#FD9646] data-[state=active]:border-b-[#FD9646] font-medium text-gray-600 data-[state=active]:text-gray-900 hover:text-gray-900 transition-all duration-200 flex items-center gap-2", children: [_jsx(Palette, { className: "h-4 w-4" }), "Preferences"] })] }), _jsx(TabsContent, { value: "users", className: "space-y-4", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Users, { className: "h-5 w-5" }), "User Management"] }), _jsx(CardDescription, { children: "Manage system users and their access permissions" })] }), _jsxs(Dialog, { open: isCreatingUser, onOpenChange: setIsCreatingUser, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add User"] }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Create New User" }), _jsx(DialogDescription, { children: "Add a new user to the system with appropriate permissions" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "userName", children: "Full Name" }), _jsx(Input, { id: "userName", value: newUser.name, onChange: (e) => setNewUser({ ...newUser, name: e.target.value }), placeholder: "Enter full name" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "userEmail", children: "Email Address" }), _jsx(Input, { id: "userEmail", type: "email", value: newUser.email, onChange: (e) => setNewUser({ ...newUser, email: e.target.value }), placeholder: "Enter email address" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "userRole", children: "Role" }), _jsxs(Select, { value: newUser.role, onValueChange: (value) => setNewUser({ ...newUser, role: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Administrator", children: "Administrator" }), _jsx(SelectItem, { value: "Contract Manager", children: "Contract Manager" }), _jsx(SelectItem, { value: "Offer Manager", children: "Offer Manager" }), _jsx(SelectItem, { value: "Support Agent", children: "Support Agent" }), _jsx(SelectItem, { value: "Analyst", children: "Analyst" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "userDepartment", children: "Department" }), _jsx(Input, { id: "userDepartment", value: newUser.department, onChange: (e) => setNewUser({ ...newUser, department: e.target.value }), placeholder: "Enter department" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "userPhone", children: "Phone Number" }), _jsx(Input, { id: "userPhone", value: newUser.phone, onChange: (e) => setNewUser({ ...newUser, phone: e.target.value }), placeholder: "Enter phone number" })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsCreatingUser(false), children: "Cancel" }), _jsx(Button, { onClick: handleCreateUser, children: "Create User" })] })] })] })] }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Name" }), _jsx(TableHead, { children: "Email" }), _jsx(TableHead, { children: "Role" }), _jsx(TableHead, { children: "Department" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Last Login" }), _jsx(TableHead, { children: "Actions" })] }) }), _jsx(TableBody, { children: users.map((user) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: user.name }), _jsx(TableCell, { children: user.email }), _jsx(TableCell, { children: _jsx(Badge, { variant: getRoleColor(user.role), children: user.role }) }), _jsx(TableCell, { children: user.department }), _jsx(TableCell, { children: _jsx(Badge, { variant: getStatusColor(user.status), children: user.status }) }), _jsx(TableCell, { children: user.lastLogin }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }) })] }, user.id))) })] }) })] }) }), _jsx(TabsContent, { value: "roles", className: "space-y-4", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Shield, { className: "h-5 w-5" }), "Roles & Access Control"] }), _jsx(CardDescription, { children: "Manage user roles and their system permissions" })] }), _jsxs(Dialog, { open: isCreatingRole, onOpenChange: setIsCreatingRole, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Create Role"] }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Create New Role" }), _jsx(DialogDescription, { children: "Define a new role with specific permissions" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "roleName", children: "Role Name" }), _jsx(Input, { id: "roleName", value: newRole.name, onChange: (e) => setNewRole({ ...newRole, name: e.target.value }), placeholder: "Enter role name" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "roleDescription", children: "Description" }), _jsx(Textarea, { id: "roleDescription", value: newRole.description, onChange: (e) => setNewRole({ ...newRole, description: e.target.value }), placeholder: "Describe the role's purpose and responsibilities" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Permissions" }), _jsx("div", { className: "grid grid-cols-2 gap-2 mt-2", children: ['Dashboard', 'COINHUB', 'CONTRAQ', 'Offer Management', 'CONVOY', 'Settings'].map((permission) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: permission, checked: newRole.permissions.includes(permission), onCheckedChange: (checked) => handlePermissionChange(permission, checked, 'role') }), _jsx(Label, { htmlFor: permission, className: "text-sm", children: permission })] }, permission))) })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsCreatingRole(false), children: "Cancel" }), _jsx(Button, { onClick: handleCreateRole, children: "Create Role" })] })] })] })] }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: roles.map((role) => (_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-medium", children: role.name }), _jsxs(Badge, { variant: role.color, children: [role.userCount, " user", role.userCount !== 1 ? 's' : ''] })] }), _jsx("p", { className: "text-sm text-muted-foreground mb-3", children: role.description }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-xs font-medium", children: "Permissions:" }), _jsxs("div", { className: "flex flex-wrap gap-1", children: [role.permissions.slice(0, 3).map((permission) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: permission }, permission))), role.permissions.length > 3 && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: ["+", role.permissions.length - 3, " more"] }))] })] }), _jsxs("div", { className: "flex gap-2 mt-3", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "flex-1", children: [_jsx(Edit, { className: "h-3 w-3 mr-1" }), "Edit"] }), _jsx(Button, { variant: "outline", size: "sm", children: _jsx(Trash2, { className: "h-3 w-3" }) })] })] }) }, role.id))) }) })] }) }), _jsx(TabsContent, { value: "screen-management", className: "space-y-4", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Monitor, { className: "h-5 w-5" }), "Screen & Menu Management"] }), _jsx(CardDescription, { children: "Control which screens and menu items are visible to users in the navigation" })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs(Badge, { variant: "outline", children: [getEnabledCount(), " of ", getTotalCount(), " enabled"] }) })] }) }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between p-4 bg-muted rounded-lg", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: "Bulk Actions" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Quickly enable or disable multiple screens at once" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleBulkToggle(true), children: [_jsx(CheckCircle, { className: "h-4 w-4 mr-1" }), "Enable All"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleBulkToggle(false), children: [_jsx(EyeOff, { className: "h-4 w-4 mr-1" }), "Disable All"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: handleResetToDefaults, children: [_jsx(RotateCcw, { className: "h-4 w-4 mr-1" }), "Reset to Defaults"] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "font-medium", children: "Available Screens" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Toggle individual screens on or off. Disabled screens will not appear in the navigation." })] }), _jsx("div", { className: "space-y-3", children: availableScreens.map(screen => renderScreenItem(screen)) })] }), _jsx(Card, { className: "border-blue-200 bg-blue-50", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Info, { className: "h-5 w-5 text-blue-600 mt-0.5" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-blue-900", children: "Screen Management Notes" }), _jsxs("ul", { className: "text-sm text-blue-800 mt-2 space-y-1", children: [_jsx("li", { children: "\u2022 Dashboard and Settings cannot be disabled as they are core system components" }), _jsx("li", { children: "\u2022 Disabling a parent module will automatically disable all its sub-modules" }), _jsx("li", { children: "\u2022 Changes take effect immediately and apply to all users" }), _jsx("li", { children: "\u2022 Users currently viewing disabled screens will be redirected to the Dashboard" }), _jsx("li", { children: "\u2022 The CONVOY module includes comprehensive customer support management features" })] })] })] }) }) })] })] }) }), _jsx(TabsContent, { value: "security", className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Lock, { className: "h-5 w-5" }), "Authentication Settings"] }), _jsx(CardDescription, { children: "Configure security and authentication policies" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "sessionTimeout", children: "Session Timeout (minutes)" }), _jsxs(Select, { value: systemSettings.sessionTimeout, onValueChange: (value) => setSystemSettings({ ...systemSettings, sessionTimeout: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "15", children: "15 minutes" }), _jsx(SelectItem, { value: "30", children: "30 minutes" }), _jsx(SelectItem, { value: "60", children: "1 hour" }), _jsx(SelectItem, { value: "120", children: "2 hours" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "passwordExpiry", children: "Password Expiry (days)" }), _jsxs(Select, { value: systemSettings.passwordExpiry, onValueChange: (value) => setSystemSettings({ ...systemSettings, passwordExpiry: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "30", children: "30 days" }), _jsx(SelectItem, { value: "60", children: "60 days" }), _jsx(SelectItem, { value: "90", children: "90 days" }), _jsx(SelectItem, { value: "never", children: "Never expire" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "maxLoginAttempts", children: "Max Login Attempts" }), _jsxs(Select, { value: systemSettings.maxLoginAttempts, onValueChange: (value) => setSystemSettings({ ...systemSettings, maxLoginAttempts: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "3", children: "3 attempts" }), _jsx(SelectItem, { value: "5", children: "5 attempts" }), _jsx(SelectItem, { value: "10", children: "10 attempts" })] })] })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Database, { className: "h-5 w-5" }), "Data Management"] }), _jsx(CardDescription, { children: "Configure data retention and backup policies" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "dataRetention", children: "Data Retention (days)" }), _jsxs(Select, { value: systemSettings.dataRetention, onValueChange: (value) => setSystemSettings({ ...systemSettings, dataRetention: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "180", children: "6 months" }), _jsx(SelectItem, { value: "365", children: "1 year" }), _jsx(SelectItem, { value: "730", children: "2 years" }), _jsx(SelectItem, { value: "1095", children: "3 years" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "backupFrequency", children: "Backup Frequency" }), _jsxs(Select, { value: systemSettings.backupFrequency, onValueChange: (value) => setSystemSettings({ ...systemSettings, backupFrequency: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "hourly", children: "Hourly" }), _jsx(SelectItem, { value: "daily", children: "Daily" }), _jsx(SelectItem, { value: "weekly", children: "Weekly" })] })] })] }), _jsx(Separator, {}), _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "font-medium", children: "Security Alerts" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(Label, { children: "Failed Login Alerts" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Alert on suspicious login attempts" })] }), _jsx(Switch, { defaultChecked: true })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(Label, { children: "Data Export Alerts" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Alert on large data exports" })] }), _jsx(Switch, { defaultChecked: true })] })] })] })] })] }) }), _jsx(TabsContent, { value: "system", className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Bell, { className: "h-5 w-5" }), "Notification Settings"] }), _jsx(CardDescription, { children: "Configure system notifications and alerts" })] }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(Label, { children: "Email Notifications" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Send notifications via email" })] }), _jsx(Switch, { checked: systemSettings.notifications.email, onCheckedChange: (checked) => setSystemSettings({
                                                                    ...systemSettings,
                                                                    notifications: { ...systemSettings.notifications, email: checked }
                                                                }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(Label, { children: "Browser Notifications" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Show browser push notifications" })] }), _jsx(Switch, { checked: systemSettings.notifications.browser, onCheckedChange: (checked) => setSystemSettings({
                                                                    ...systemSettings,
                                                                    notifications: { ...systemSettings.notifications, browser: checked }
                                                                }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(Label, { children: "Breach Alerts" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Immediate breach notifications" })] }), _jsx(Switch, { checked: systemSettings.notifications.breach, onCheckedChange: (checked) => setSystemSettings({
                                                                    ...systemSettings,
                                                                    notifications: { ...systemSettings.notifications, breach: checked }
                                                                }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(Label, { children: "Contract Renewals" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Contract renewal reminders" })] }), _jsx(Switch, { checked: systemSettings.notifications.renewal, onCheckedChange: (checked) => setSystemSettings({
                                                                    ...systemSettings,
                                                                    notifications: { ...systemSettings.notifications, renewal: checked }
                                                                }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(Label, { children: "Offer Updates" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Offer status and response notifications" })] }), _jsx(Switch, { checked: systemSettings.notifications.offers, onCheckedChange: (checked) => setSystemSettings({
                                                                    ...systemSettings,
                                                                    notifications: { ...systemSettings.notifications, offers: checked }
                                                                }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(Label, { children: "Support Tickets" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Customer support ticket notifications" })] }), _jsx(Switch, { checked: systemSettings.notifications.support, onCheckedChange: (checked) => setSystemSettings({
                                                                    ...systemSettings,
                                                                    notifications: { ...systemSettings.notifications, support: checked }
                                                                }) })] })] }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Server, { className: "h-5 w-5" }), "System Information"] }), _jsx(CardDescription, { children: "Current system status and information" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm", children: "System Version:" }), _jsx("span", { className: "text-sm font-medium", children: "SOAR-AI v2.1.0" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm", children: "Last Update:" }), _jsx("span", { className: "text-sm font-medium", children: "June 17, 2024" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm", children: "Database Status:" }), _jsx(Badge, { variant: "default", className: "text-xs", children: "Online" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm", children: "Backup Status:" }), _jsx(Badge, { variant: "default", className: "text-xs", children: "Current" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm", children: "Active Users:" }), _jsx("span", { className: "text-sm font-medium", children: "47" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm", children: "Storage Used:" }), _jsx("span", { className: "text-sm font-medium", children: "2.3 GB / 10 GB" })] })] }), _jsx(Separator, {}), _jsxs("div", { className: "space-y-2", children: [_jsxs(Button, { variant: "outline", className: "w-full", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Check for Updates"] }), _jsxs(Button, { variant: "outline", className: "w-full", children: [_jsx(Database, { className: "h-4 w-4 mr-2" }), "Run System Diagnostics"] })] })] })] })] }) }), _jsx(TabsContent, { value: "preferences", className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Palette, { className: "h-5 w-5" }), "Appearance Settings"] }), _jsx(CardDescription, { children: "Customize the look and feel of the application" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "theme", children: "Theme" }), _jsxs(Select, { value: systemSettings.theme, onValueChange: (value) => setSystemSettings({ ...systemSettings, theme: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "light", children: "Light Mode" }), _jsx(SelectItem, { value: "dark", children: "Dark Mode" }), _jsx(SelectItem, { value: "system", children: "System Default" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "language", children: "Language" }), _jsxs(Select, { value: systemSettings.language, onValueChange: (value) => setSystemSettings({ ...systemSettings, language: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "en", children: "English" }), _jsx(SelectItem, { value: "es", children: "Spanish" }), _jsx(SelectItem, { value: "fr", children: "French" }), _jsx(SelectItem, { value: "de", children: "German" })] })] })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Globe, { className: "h-5 w-5" }), "Regional Settings"] }), _jsx(CardDescription, { children: "Configure date, time, and regional preferences" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "dateFormat", children: "Date Format" }), _jsxs(Select, { value: systemSettings.dateFormat, onValueChange: (value) => setSystemSettings({ ...systemSettings, dateFormat: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "MM/DD/YYYY", children: "MM/DD/YYYY" }), _jsx(SelectItem, { value: "DD/MM/YYYY", children: "DD/MM/YYYY" }), _jsx(SelectItem, { value: "YYYY-MM-DD", children: "YYYY-MM-DD" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "timezone", children: "Timezone" }), _jsxs(Select, { value: systemSettings.timezone, onValueChange: (value) => setSystemSettings({ ...systemSettings, timezone: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "UTC-8", children: "Pacific Time (UTC-8)" }), _jsx(SelectItem, { value: "UTC-5", children: "Eastern Time (UTC-5)" }), _jsx(SelectItem, { value: "UTC+0", children: "GMT (UTC+0)" }), _jsx(SelectItem, { value: "UTC+1", children: "Central European Time (UTC+1)" })] })] })] })] })] })] }) })] })] }));
}
