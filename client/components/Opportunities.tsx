import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { useLeadApi } from "../hooks/api/useLeadApi";
import { toast } from "sonner";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  Building2,
  Phone,
  Mail,
  Globe,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Edit,
  Eye,
  Filter,
  Search,
  Download,
  RefreshCw,
  Target,
  BarChart3,
  Activity,
  FileText,
  Handshake,
  Gift,
  Calculator,
  PieChart,
  Award,
  Zap,
  ArrowRight,
  History,
  MessageCircle,
  User,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface OpportunitiesProps {
  initialFilters?: any;
  onNavigate: (screen: string, filters?: any) => void;
}

// Define opportunity interface based on your Django model
interface Activity {
  id: number;
  type: string;
  type_display: string;
  description: string;
  date: string;
  created_at: string;
  created_by_name: string;
}

interface Opportunity {
  id: number;
  leadId?: number;
  name: string;
  stage: string;
  probability: number;
  value: number;
  estimated_close_date: string;
  actual_close_date?: string;
  description?: string;
  next_steps?: string;
  created_at: string;
  updated_at: string;
  activities?: Activity[];
  latest_activities?: Activity[];
  lead_info?: {
    company: {
      id: number;
      name: string;
      industry: string;
      location: string;
      employee_count?: number;
      size?: string;
    };
    contact: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      position?: string;
    };
  };
}

const stages = [
  {
    id: "discovery",
    label: "Discovery",
    color: "bg-blue-500",
    headerColor: "bg-blue-50",
    probability: 25,
  },
  {
    id: "proposal",
    label: "Proposal",
    color: "bg-orange-500",
    headerColor: "bg-orange-50",
    probability: 65,
  },
  {
    id: "negotiation",
    label: "Negotiation",
    color: "bg-purple-500",
    headerColor: "bg-purple-50",
    probability: 80,
  },
  {
    id: "closed_won",
    label: "Closed Won",
    color: "bg-green-500",
    headerColor: "bg-green-50",
    probability: 100,
  },
  {
    id: "closed_lost",
    label: "Closed Lost",
    color: "bg-red-500",
    headerColor: "bg-red-50",
    probability: 0,
  },
];

const ItemTypes = {
  OPPORTUNITY: "opportunity",
};

// Activity Accordion Component
interface ActivityAccordionProps {
  activities: Activity[];
}

const ActivityAccordion = memo(({ activities }: ActivityAccordionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedActivities = isExpanded ? activities : activities.slice(0, 1);
  const remainingCount = activities.length - 1;

  return (
    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <div className="text-blue-900 font-medium text-sm">
          Recent Activities ({activities.length})
        </div>
        {activities.length > 1 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                <span>Show {remainingCount} more</span>
                <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>
      <div className="space-y-2">
        {displayedActivities.map((activity) => (
          <div key={activity.id} className="text-xs text-blue-700 p-2 bg-white rounded border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              <span className="font-medium">{activity.type_display}</span>
              <span className="text-blue-600">
                {new Date(activity.date).toLocaleDateString()}
              </span>
              <span className="text-blue-500 ml-auto">
                by {activity.created_by_name}
              </span>
            </div>
            <div className="text-blue-600 ml-3">
              {activity.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ActivityAccordion.displayName = "ActivityAccordion";

// Opportunity Card Component matching the design in the image
interface OpportunityCardProps {
  opportunity: Opportunity;
  onEdit: (opportunity: Opportunity) => void;
  onAddActivity: (opportunity: Opportunity) => void;
  onViewHistory: (opportunity: Opportunity) => void;
  onSendProposal?: (opportunity: Opportunity) => void;
  onMoveToNegotiation?: (opportunity: Opportunity) => void;
  onCloseDeal?: (opportunity: Opportunity) => void;
}

const OpportunityCard = memo(
  ({
    opportunity,
    onEdit,
    onAddActivity,
    onViewHistory,
    onSendProposal,
    onMoveToNegotiation,
    onCloseDeal,
  }: OpportunityCardProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.OPPORTUNITY,
      item: { id: opportunity.id, stage: opportunity.stage },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const company = opportunity.lead_info?.company || {
      name: "Unknown Company",
      industry: "Unknown",
      location: "Unknown",
      employee_count: 0,
    };
    const contact = opportunity.lead_info?.contact || {
      first_name: "Unknown",
      last_name: "Contact",
      email: "",
      phone: "",
      position: "",
    };

    const getBadgeColor = (stage: string) => {
      switch (stage) {
        case "discovery":
          return "bg-blue-100 text-blue-800";
        case "proposal":
          return "bg-orange-100 text-orange-800";
        case "negotiation":
          return "bg-purple-100 text-purple-800";
        case "closed_won":
          return "bg-green-100 text-green-800";
        case "closed_lost":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const formatCurrency = useCallback((amount: number | null | undefined) => {
      // Handle null, undefined, or NaN values
      const numAmount = Number(amount);
      if (!numAmount || isNaN(numAmount)) {
        return "$0";
      }

      if (numAmount >= 1000000) {
        return `$${(numAmount / 1000000).toFixed(1)}M`;
      } else if (numAmount >= 1000) {
        return `$${(numAmount / 1000).toFixed(0)}K`;
      } else {
        return `$${numAmount.toFixed(0)}`;
      }
    }, []);

    const formatDate = useCallback((dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
    }, []);

    return (
      <div
        ref={drag}
        className={`bg-white border border-gray-200 rounded-lg p-5 mb-3 cursor-pointer hover:shadow-md transition-all duration-200 ${
          isDragging ? "opacity-50 rotate-1 scale-105" : ""
        }`}
      >
        {/* Header with Company and Contact Info */}
        <div className="flex items-start justify-between p-2 mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg flex-shrink-0">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-base text-gray-900 truncate">
                  {company.name}
                </h4>
                <Badge
                  className={`text-xs px-2 py-1 ${getBadgeColor(opportunity.stage)}`}
                >
                  {stages.find((s) => s.id === opportunity.stage)?.label ||
                    opportunity.stage}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span>
                  {contact.first_name} {contact.last_name}
                </span>
                {contact.position && (
                  <>
                    <span>•</span>
                    <span>{contact.position}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(opportunity.value)}
            </div>
            <div className="text-sm text-gray-500">
              {opportunity.probability}% probability
            </div>
          </div>
        </div>

        {/* Probability Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              Probability: {opportunity.probability}%
            </span>
          </div>
          <Progress value={opportunity.probability} className="h-2" />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
          <div>
            <span className="text-gray-500">Industry:</span>
            <span className="ml-1 text-gray-900">{company.industry}</span>
          </div>
          <div>
            <span className="text-gray-500">Created:</span>
            <span className="ml-1 text-gray-900">
              {formatDate(opportunity.created_at)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Company Size:</span>
            <span className="ml-1 text-gray-900">
              {company.employee_count || "Unknown"} employees
            </span>
          </div>
          <div>
            <span className="text-gray-500">Last Activity:</span>
            <span className="ml-1 text-gray-900">
              {formatDate(opportunity.updated_at)}
            </span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          {contact.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span className="truncate max-w-[120px]">{contact.email}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{contact.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            <span>{company.location}</span>
          </div>
        </div>

        {/* Next Action Section */}
        <div className="mb-3">
          <div className="flex items-start gap-2 mb-2 rounded-lg border px-4 py-3 text-sm bg-blue-100">
            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <span className="text-blue-600 font-medium text-sm">Next Action:</span>
              <div className="text-blue-600 text-sm">
                {opportunity.next_steps || "Contract terms discussion"}
              </div>
            </div>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-gray-900 font-medium text-sm mb-1">Notes:</div>
            <div className="text-gray-600 text-sm">
              {opportunity.description || "Focused on cost optimization across multiple manufacturing sites"}
            </div>
          </div>

          {/* Recent Activities Section */}
          {opportunity.latest_activities && opportunity.latest_activities.length > 0 && (
            <ActivityAccordion activities={opportunity.latest_activities} />
          )}
        </div>

        {/* Tags/Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className="text-xs">
            {company.industry}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {company.size || "Enterprise"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Decision Maker
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8 px-3 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(opportunity);
              }}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onAddActivity(opportunity);
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Activity
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onViewHistory(opportunity);
              }}
            >
              <History className="h-3 w-3 mr-1" />
              History
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onViewHistory(opportunity);
              }}
            >
              <Eye className="h-3 w-3 mr-1" />
              Details
            </Button>
          </div>
          <div className="flex gap-2">
            {/* Stage-specific Action Buttons */}
            {opportunity.stage === "proposal" && onSendProposal && (
              <Button
                size="sm"
                className="h-8 px-3 text-xs bg-[#eff6ff] border border-[#bedbff] text-[#1447e6] rounded-md font-medium hover:bg-[#bedbff]"
                onClick={(e) => {
                  e.stopPropagation();
                  onSendProposal(opportunity);
                }}
              >
                <FileText className="h-3 w-3 mr-1" />
                Send Proposal
              </Button>
            )}

            {opportunity.stage === "proposal" && onMoveToNegotiation && (
              <Button
                size="sm"
                className="h-8 px-3 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveToNegotiation(opportunity);
                }}
              >
                <ArrowRight className="h-3 w-3 mr-1" />
                Move to Negotiation
              </Button>
            )}

            {opportunity.stage === "negotiation" && onCloseDeal && (
              <Button
                size="sm"
                className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseDeal(opportunity);
                }}
              >
                <Handshake className="h-3 w-3 mr-1" />
                Close Deal
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  },
);

OpportunityCard.displayName = "OpportunityCard";

// Pipeline Column Component
interface PipelineColumnProps {
  stage: any;
  opportunities: Opportunity[];
  onDrop: (opportunityId: string, newStage: string) => void;
  onEdit: (opportunity: Opportunity) => void;
  onAddActivity: (opportunity: Opportunity) => void;
  onViewHistory: (opportunity: Opportunity) => void;
  onSendProposal?: (opportunity: Opportunity) => void;
  onMoveToNegotiation?: (opportunity: Opportunity) => void;
  onCloseDeal?: (opportunity: Opportunity) => void;
}

const PipelineColumn = memo(
  ({
    stage,
    opportunities,
    onDrop,
    onEdit,
    onAddActivity,
    onViewHistory,
    onSendProposal,
    onMoveToNegotiation,
    onCloseDeal,
  }: PipelineColumnProps) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: ItemTypes.OPPORTUNITY,
      drop: (item: { id: string; stage: string }) => {
        if (item.stage !== stage.id) {
          onDrop(item.id, stage.id);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }));

    const formatCurrency = useCallback((amount: number | null | undefined) => {
      // Handle null, undefined, or NaN values
      const numAmount = Number(amount);
      if (!numAmount || isNaN(numAmount)) {
        return "$0";
      }

      if (numAmount >= 1000000) {
        return `$${(numAmount / 1000000).toFixed(1)}M`;
      } else if (numAmount >= 1000) {
        return `$${(numAmount / 1000).toFixed(0)}K`;
      } else {
        return `$${numAmount.toFixed(0)}`;
      }
    }, []);

    const totalValue = useMemo(
      () => opportunities.reduce((sum, opp) => sum + opp.value, 0),
      [opportunities],
    );

    return (
      <div
        ref={drop}
        className={`flex-1 min-w-80 ${isOver ? "ring-2 ring-blue-400 ring-opacity-50" : ""}`}
      >
        <div
          className={`${stage.headerColor} border-b-2 border-${stage.color.split("-")[1]}-500 p-3 rounded-t-lg`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-gray-900">{stage.label}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {opportunities.length}
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">
                {formatCurrency(totalValue)}
              </span>
            </div>
          </div>
        </div>

        <ScrollArea
          className={`${stage.color.replace("bg-", "bg-").replace("-500", "-50")} border-2 border-t-0 border-${stage.color.split("-")[1]}-200 rounded-b-lg min-h-[600px] p-3`}
        >
          <div className="space-y-3">
            {opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onEdit={onEdit}
                onAddActivity={onAddActivity}
                onViewHistory={onViewHistory}
                onSendProposal={onSendProposal}
                onMoveToNegotiation={onMoveToNegotiation}
                onCloseDeal={onCloseDeal}
              />
            ))}

            {opportunities.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <Target className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No opportunities</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  },
);

PipelineColumn.displayName = "PipelineColumn";

export function Opportunities({
  initialFilters,
  onNavigate,
}: OpportunitiesProps) {
  const { getOpportunities, updateOpportunityStage, addOpportunityActivity, getOpportunityActivities, getOpportunityHistory, getHistory } = useLeadApi();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showProposalDialog, setShowProposalDialog] = useState(false);
  const [currentView, setCurrentView] = useState("list");
  const [filters, setFilters] = useState({
    stage: "all",
    search: "",
  });
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [editForm, setEditForm] = useState({
    stage: "",
    probability: "",
    value: "",
    estimated_close_date: "",
    next_steps: "",
    description: "",
  });

  const [activityForm, setActivityForm] = useState({
    type: "call",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [proposalForm, setProposalForm] = useState({
    title: "",
    description: "",
    validityPeriod: "30",
    specialTerms: "",
    deliveryMethod: "email",
  });

  // Fetch opportunities data on component mount and when filters change
  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true);
      setCurrentPage(1); // Reset to first page on filter change
      try {
        const data = await getOpportunities({ ...filters }); // Fetch all opportunities
        console.log("Fetched opportunities data:", data);

        // Handle different API response formats
        let opportunitiesArray = [];
        if (Array.isArray(data)) {
          opportunitiesArray = data;
        } else if (data && Array.isArray(data.results)) {
          opportunitiesArray = data.results;
        } else if (data && Array.isArray(data.opportunities)) {
          opportunitiesArray = data.opportunities;
        } else {
          console.warn("Unexpected opportunities data format:", data);
          opportunitiesArray = [];
        }

        console.log("Setting opportunities:", opportunitiesArray);
        setOpportunities(opportunitiesArray);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        setOpportunities([]);
        toast.error("Failed to fetch opportunities. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, [getOpportunities, filters]);

  // Handle new opportunity from leads
  useEffect(() => {
    if (initialFilters?.newOpportunity) {
      const newOpportunity = {
        id:
          initialFilters.newOpportunity.id ||
          Math.max(...opportunities.map((o) => o.id), 0) + 1,
        leadId: initialFilters.newOpportunity.leadId || null,
        name: `${initialFilters.newOpportunity.company || "Unknown Company"} - Corporate Travel Solution`,
        stage: initialFilters.newOpportunity.stage || "proposal",
        probability: initialFilters.newOpportunity.probability || 65,
        value:
          initialFilters.newOpportunity.value ||
          initialFilters.newOpportunity.dealValue ||
          250000,
        estimated_close_date:
          initialFilters.newOpportunity.estimated_close_date ||
          initialFilters.newOpportunity.expectedCloseDate ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        description:
          initialFilters.newOpportunity.description ||
          initialFilters.newOpportunity.notes ||
          "Converted from qualified lead",
        next_steps:
          initialFilters.newOpportunity.next_steps ||
          "Send initial proposal and schedule presentation",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        lead_info: {
          company: {
            id: 1,
            name: initialFilters.newOpportunity.company || "Unknown Company",
            industry: initialFilters.newOpportunity.industry || "Unknown",
            location:
              initialFilters.newOpportunity.location || "Unknown Location",
            employee_count: initialFilters.newOpportunity.employees || 0,
          },
          contact: {
            id: 1,
            first_name:
              initialFilters.newOpportunity.contact?.split(" ")[0] || "Unknown",
            last_name:
              initialFilters.newOpportunity.contact
                ?.split(" ")
                .slice(1)
                .join(" ") || "Contact",
            email: initialFilters.newOpportunity.email || "unknown@email.com",
            phone: initialFilters.newOpportunity.phone || "N/A",
            position: initialFilters.newOpportunity.title || "Contact",
          },
        },
      };

      setOpportunities((prev) => [newOpportunity, ...prev]);
      setSuccessMessage(
        initialFilters.message ||
          `${newOpportunity.lead_info.company.name} has been converted to an opportunity`,
      );
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  }, [initialFilters, opportunities]);

  // Calculate pipeline metrics
  const safeOpportunities = useMemo(
    () => (Array.isArray(opportunities) ? opportunities : []),
    [opportunities],
  );
  const totalValue = useMemo(() => {
    return safeOpportunities.reduce((sum, opp) => {
      const oppValue =
        typeof opp?.value === "string"
          ? parseFloat(opp.value)
          : opp?.value || 0;
      return sum + oppValue;
    }, 0);
  }, [safeOpportunities]);

  const weightedValue = useMemo(() => {
    return safeOpportunities.reduce((sum, opp) => {
      const oppValue =
        typeof opp?.value === "string"
          ? parseFloat(opp.value)
          : opp?.value || 0;
      const oppProbability = opp?.probability || 0;
      return sum + (oppValue * oppProbability) / 100;
    }, 0);
  }, [safeOpportunities]);

  const avgDealSize = useMemo(() => {
    return safeOpportunities.length > 0
      ? totalValue / safeOpportunities.length
      : 0;
  }, [safeOpportunities, totalValue]);

  const winRate = useMemo(() => {
    if (safeOpportunities.length === 0) return 0;
    const closedWonCount = safeOpportunities.filter(
      (opp) => opp?.stage === "closed_won",
    ).length;
    return (closedWonCount / safeOpportunities.length) * 100;
  }, [safeOpportunities]);

  const stageMetrics = useMemo(
    () =>
      stages.map((stage) => {
        const stageOpps = safeOpportunities.filter(
          (opp) => opp?.stage === stage.id,
        );
        const stageValue = stageOpps.reduce((sum, opp) => {
          const oppValue =
            typeof opp?.value === "string"
              ? parseFloat(opp.value)
              : opp?.value || 0;
          return sum + oppValue;
        }, 0);

        return {
          ...stage,
          count: stageOpps.length,
          value: stageValue,
        };
      }),
    [safeOpportunities],
  );

  // Filtered opportunities
  const filteredOpportunities = useMemo(
    () =>
      safeOpportunities.filter((opp) => {
        if (!opp) return false;
        if (
          filters.stage &&
          filters.stage !== "all" &&
          opp.stage !== filters.stage
        )
          return false;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const companyName = opp.lead_info?.company?.name?.toLowerCase() || "";
          const firstName =
            opp.lead_info?.contact?.first_name?.toLowerCase() || "";
          const lastName =
            opp.lead_info?.contact?.last_name?.toLowerCase() || "";

          if (
            !companyName.includes(searchLower) &&
            !firstName.includes(searchLower) &&
            !lastName.includes(searchLower)
          ) {
            return false;
          }
        }
        return true;
      }),
    [safeOpportunities, filters],
  );

  // Format currency function
  const formatCurrency = useCallback((amount: number | null | undefined) => {
    // Handle null, undefined, or NaN values
    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount)) {
      return "$0";
    }

    if (numAmount >= 1000000) {
      return `$${(numAmount / 1000000).toFixed(1)}M`;
    } else if (numAmount >= 1000) {
      return `$${(numAmount / 1000).toFixed(0)}K`;
    } else {
      return `$${numAmount.toFixed(0)}`;
    }
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOpportunities = filteredOpportunities.slice(
    startIndex,
    endIndex,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Event handlers
  const handleEditOpportunity = useCallback((opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setEditForm({
      stage: opportunity.stage,
      probability: opportunity.probability.toString(),
      value: opportunity.value.toString(),
      estimated_close_date: opportunity.estimated_close_date,
      next_steps: opportunity.next_steps || "",
      description: opportunity.description || "",
    });
    setShowEditDialog(true);
  }, []);

  const handleAddActivity = useCallback((opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setActivityForm({
      type: "call",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setShowActivityDialog(true);
  }, []);

  const handleViewHistory = useCallback(async (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsLoadingHistory(true);
    setHistoryData([]);
    setShowHistoryDialog(true);
    
    try {
      // Use the new comprehensive history API endpoint
      const historyData = await getOpportunityHistory(opportunity.id);
      
      // Ensure we have an array, even if empty
      const formattedHistory = Array.isArray(historyData) ? historyData : [];
      
      setHistoryData(formattedHistory);
      
      // Show success message if we got data, info if empty
      if (formattedHistory.length > 0) {
        console.log(`Loaded ${formattedHistory.length} history items`);
      } else {
        console.log('No history data available for this opportunity');
      }
    } catch (error) {
      console.error('Error fetching opportunity history:', error);
      // Don't show toast error since we handle it gracefully now
      setHistoryData([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [getOpportunityHistory]);

  const handleSendProposal = useCallback((opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setProposalForm({
      title: `Travel Solutions Proposal - ${opportunity.lead_info?.company?.name}`,
      description: `Comprehensive travel management solution tailored for ${opportunity.lead_info?.company?.name}'s needs including cost optimization, policy compliance, and reporting analytics.`,
      validityPeriod: "30",
      specialTerms: "",
      deliveryMethod: "email",
    });
    setShowProposalDialog(true);
  }, []);

  const handleMoveToNegotiation = useCallback((opportunity: Opportunity) => {
    const updatedOpportunity = {
      ...opportunity,
      stage: "negotiation",
      probability: 80,
      updated_at: new Date().toISOString(),
    };

    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === opportunity.id ? updatedOpportunity : opp)),
    );

    setSuccessMessage(
      `${opportunity.lead_info?.company?.name} opportunity moved to Negotiation stage`,
    );
    setTimeout(() => setSuccessMessage(""), 5000);
  }, []);

  const handleCloseDeal = useCallback((opportunity: Opportunity) => {
    const updatedOpportunity = {
      ...opportunity,
      stage: "closed_won",
      probability: 100,
      actual_close_date: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString(),
    };

    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === opportunity.id ? updatedOpportunity : opp)),
    );

    setSuccessMessage(
      `${opportunity.lead_info?.company?.name} deal closed successfully! 🎉`,
    );
    setTimeout(() => setSuccessMessage(""), 5000);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!selectedOpportunity) return;

    // Validate and convert data types properly
    const probability = parseInt(editForm.probability);
    const value = parseFloat(editForm.value);

    // Validate inputs
    if (isNaN(probability) || probability < 0 || probability > 100) {
      toast.error('Probability must be a number between 0 and 100');
      return;
    }

    if (isNaN(value) || value < 0) {
      toast.error('Value must be a positive number');
      return;
    }

    if (!editForm.estimated_close_date) {
      toast.error('Estimated close date is required');
      return;
    }

    const updateData = {
      stage: editForm.stage,
      probability: probability,
      value: value,
      estimated_close_date: editForm.estimated_close_date,
      next_steps: editForm.next_steps || '',
      description: editForm.description || '',
    };

    try {
      console.log('Updating opportunity with data:', updateData);

      // Update via API
      const response = await updateOpportunityStage(selectedOpportunity.id, updateData);

      console.log('Update response:', response);

      const updatedOpportunity = {
        ...selectedOpportunity,
        ...updateData,
        updated_at: new Date().toISOString(),
      };

      // Update local state with the response or optimistic update
      setOpportunities((prev) =>
        prev.map((opp) =>
          opp.id === selectedOpportunity.id ? updatedOpportunity : opp,
        ),
      );

      setShowEditDialog(false);
      setSuccessMessage(
        `${selectedOpportunity.lead_info?.company?.name} opportunity has been updated`,
      );
      setTimeout(() => setSuccessMessage(""), 5000);

      toast.success(`${selectedOpportunity.lead_info?.company?.name} opportunity updated successfully!`);

    } catch (error) {
      console.error('Error updating opportunity:', error);
      console.error('Error details:', error.response?.data);

      // Show specific error message if available
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.response?.data?.error ||
                          'Failed to update opportunity. Please try again.';
      toast.error(errorMessage);

      // Optionally refresh opportunities to ensure consistency
      try {
        const data = await getOpportunities({ ...filters });
        const opportunitiesArray = Array.isArray(data) ? data : data?.results || data?.opportunities || [];
        setOpportunities(opportunitiesArray);
      } catch (refreshError) {
        console.error("Error refreshing opportunities:", refreshError);
      }
    }
  }, [selectedOpportunity, editForm, updateOpportunityStage, getOpportunities, filters]);

  const handleSaveActivity = useCallback(async () => {
    if (!selectedOpportunity) return;

    if (!activityForm.description.trim()) {
      toast.error('Activity description is required');
      return;
    }

    try {
      // Add user information to the activity data
      const activityWithUser = {
        ...activityForm,
        created_by_name: 'Current User', // In a real app, this would come from auth context
      };

      const response = await addOpportunityActivity(selectedOpportunity.id, activityWithUser);

      // Refresh opportunities to show the new activity
      const updatedOpportunities = await getOpportunities({ ...filters });
      const opportunitiesArray = Array.isArray(updatedOpportunities) ? updatedOpportunities : updatedOpportunities?.results || updatedOpportunities?.opportunities || [];
      setOpportunities(opportunitiesArray);

      setShowActivityDialog(false);
      setSuccessMessage(
        `Activity added to ${selectedOpportunity.lead_info?.company?.name} opportunity`,
      );
      setTimeout(() => setSuccessMessage(""), 5000);
      toast.success('Activity added successfully!');

    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Failed to save activity. Please try again.');
    }
  }, [selectedOpportunity, activityForm, addOpportunityActivity, getOpportunities, filters, setOpportunities]);

  const handleSaveProposal = useCallback(() => {
    if (!selectedOpportunity) return;

    // In a real implementation, you would send this to the API
    setShowProposalDialog(false);
    setSuccessMessage(
      `Proposal sent to ${selectedOpportunity.lead_info?.company?.name} successfully`,
    );
    setTimeout(() => setSuccessMessage(""), 5000);
  }, [selectedOpportunity]);

  // Drag and Drop Handler
  const handleDrop = useCallback(
    async (opportunityId: string, newStage: string) => {
      if (!opportunityId || !newStage) {
        toast.error("Invalid opportunity or stage data");
        return;
      }

      try {
        // Update via API
        await updateOpportunityStage(parseInt(opportunityId), {
          stage: newStage,
        });

        // Update local state
        setOpportunities((prevOpportunities) =>
          prevOpportunities.map((opportunity) =>
            opportunity.id === parseInt(opportunityId)
              ? {
                  ...opportunity,
                  stage: newStage,
                  probability:
                    stages.find((s) => s.id === newStage)?.probability ||
                    opportunity.probability,
                  updated_at: new Date().toISOString(),
                }
              : opportunity,
          ),
        );

        const stageName =
          stages.find((s) => s.id === newStage)?.label || newStage;
        const oppName =
          opportunities.find((o) => o.id === parseInt(opportunityId))?.lead_info
            ?.company?.name || "Opportunity";
        setSuccessMessage(`${oppName} moved to ${stageName} stage`);
        setTimeout(() => setSuccessMessage(""), 5000);
      } catch (error) {
        console.error("Error updating opportunity stage:", error);
        toast.error("Failed to update opportunity stage. Please try again.");

        // Refresh opportunities to revert any optimistic updates
        try {
          const data = await getOpportunities({
            ...filters,
            page: currentPage,
            limit: 25,
          });
          setOpportunities(Array.isArray(data) ? data : []);
        } catch (refreshError) {
          console.error("Error refreshing opportunities:", refreshError);
        }
      }
    },
    [
      opportunities,
      stages,
      updateOpportunityStage,
      getOpportunities,
      filters,
      currentPage,
    ],
  );

  const getOpportunitiesForStage = useCallback(
    (stageId: string) => {
      return filteredOpportunities.filter(
        (opportunity) => opportunity.stage === stageId,
      );
    },
    [filteredOpportunities],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        {/* Success Message */}
        {successMessage && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Sales Opportunities
            </h2>
            <p className="text-gray-600">
              Manage your sales pipeline and track deal progress
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Pipeline Metrics - Matching the design */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Pipeline Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalValue)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {opportunities.length} opportunities
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Weighted Pipeline
              </CardTitle>
              <Target className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(weightedValue)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Probability adjusted value
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Deal Size
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(avgDealSize)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Average opportunity value
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Win Rate
              </CardTitle>
              <Award className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {winRate.toFixed(0)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Closed won percentage
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline by Stage - Matching the design */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Pipeline by Stage
            </CardTitle>
            <CardDescription className="text-gray-600">
              Opportunities distribution across sales stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-8">
              {stageMetrics.map((stage, index) => (
                <div key={stage.id} className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${stage.color} text-white flex items-center justify-center mx-auto mb-3 text-lg font-bold`}
                  >
                    {stage.count}
                  </div>
                  <p className="font-medium text-sm text-gray-900 mb-1">
                    {stage.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(stage.value)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
          <div className="flex gap-4 flex-1">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search opportunities..."
                className="pl-10"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>
            <Select
              value={filters.stage}
              onValueChange={(value) =>
                setFilters({ ...filters, stage: value })
              }
            >
              <SelectTrigger className="w-80">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Toggle */}
        <Tabs
          value={currentView}
          onValueChange={setCurrentView}
          className="w-full"
        >
          <div className="flex items-center justify-center mb-6">
            <TabsList className="grid w-100 grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="kanban">Pipeline View</TabsTrigger>
            </TabsList>
          </div>

          {/* List View */}
          <TabsContent value="list" className="space-y-4">
            {isLoading ? (
              // Optimized loading skeleton
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-12"></div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded w-full mb-3"></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredOpportunities.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">
                    No Opportunities Found
                  </h3>
                  <p className="text-gray-600">
                    No opportunities match your current filters.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedOpportunities.map((opportunity) => (
                    <OpportunityCard
                      key={opportunity.id}
                      opportunity={opportunity}
                      onEdit={handleEditOpportunity}
                      onAddActivity={handleAddActivity}
                      onViewHistory={handleViewHistory}
                      onSendProposal={handleSendProposal}
                      onMoveToNegotiation={handleMoveToNegotiation}
                      onCloseDeal={handleCloseDeal}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>
                        Showing {startIndex + 1}-
                        {Math.min(endIndex, filteredOpportunities.length)} of{" "}
                        {filteredOpportunities.length} opportunities
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Previous Page Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border-gray-300"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {(() => {
                          const pages = [];
                          const maxVisiblePages = 5;
                          let startPage = Math.max(
                            1,
                            currentPage - Math.floor(maxVisiblePages / 2),
                          );
                          let endPage = Math.min(
                            totalPages,
                            startPage + maxVisiblePages - 1,
                          );

                          // Adjust start page if we're near the end
                          if (endPage - startPage + 1 < maxVisiblePages) {
                            startPage = Math.max(
                              1,
                              endPage - maxVisiblePages + 1,
                            );
                          }

                          // Add first page and ellipsis if needed
                          if (startPage > 1) {
                            pages.push(
                              <Button
                                key={1}
                                variant={
                                  1 === currentPage ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(1)}
                                className={`w-9 h-9 p-0 ${1 === currentPage ? "bg-orange-500 hover:bg-orange-600 text-white" : "border-gray-300"}`}
                              >
                                1
                              </Button>,
                            );
                            if (startPage > 2) {
                              pages.push(
                                <span
                                  key="ellipsis1"
                                  className="px-2 text-gray-500"
                                >
                                  ...
                                </span>,
                              );
                            }
                          }

                          // Add visible page numbers
                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <Button
                                key={i}
                                variant={
                                  i === currentPage ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(i)}
                                className={`w-9 h-9 p-0 ${i === currentPage ? "bg-orange-500 hover:bg-orange-600 text-white" : "border-gray-300"}`}
                              >
                                {i}
                              </Button>,
                            );
                          }

                          // Add ellipsis and last page if needed
                          if (endPage < totalPages) {
                            if (endPage < totalPages - 1) {
                              pages.push(
                                <span
                                  key="ellipsis2"
                                  className="px-2 text-gray-500"
                                >
                                  ...
                                </span>,
                              );
                            }
                            pages.push(
                              <Button
                                key={totalPages}
                                variant={
                                  totalPages === currentPage
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(totalPages)}
                                className={`w-9 h-9 p-0 ${totalPages === currentPage ? "bg-orange-500 hover:bg-orange-600 text-white" : "border-gray-300"}`}
                              >
                                {totalPages}
                              </Button>,
                            );
                          }

                          return pages;
                        })()}
                      </div>

                      {/* Next Page Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border-gray-300"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Pipeline View - Kanban Board */}
          <TabsContent value="kanban" className="space-y-4">
            <div className="flex gap-6 overflow-x-auto pb-4">
              {stages.map((stage) => (
                <PipelineColumn
                  key={stage.id}
                  stage={stage}
                  opportunities={getOpportunitiesForStage(stage.id)}
                  onDrop={handleDrop}
                  onEdit={handleEditOpportunity}
                  onAddActivity={handleAddActivity}
                  onViewHistory={handleViewHistory}
                  onSendProposal={handleSendProposal}
                  onMoveToNegotiation={handleMoveToNegotiation}
                  onCloseDeal={handleCloseDeal}
                />
              ))}
            </div>

            {/* Pipeline Instructions */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium mb-2">Pipeline Instructions</h4>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded" />
                        <span>Discovery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded" />
                        <span>Proposal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded" />
                        <span>Negotiation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded" />
                        <span>Closed Won</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded" />
                        <span>Closed Lost</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Drag opportunities between columns to change their stage
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Opportunity Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Edit Opportunity -{" "}
                {selectedOpportunity?.lead_info?.company?.name}
              </DialogTitle>
              <DialogDescription>
                Update opportunity details and stage information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Stage</Label>
                  <Select
                    value={editForm.stage}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, stage: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Probability (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.probability}
                    onChange={(e) =>
                      setEditForm({ ...editForm, probability: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Deal Value ($)</Label>
                  <Input
                    type="number"
                    value={editForm.value}
                    onChange={(e) =>
                      setEditForm({ ...editForm, value: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Expected Close Date</Label>
                  <Input
                    type="date"
                    value={editForm.estimated_close_date}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        estimated_close_date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Next Steps</Label>
                <Input
                  value={editForm.next_steps}
                  onChange={(e) =>
                    setEditForm({ ...editForm, next_steps: e.target.value })
                  }
                  placeholder="Describe the next steps to take..."
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="Add opportunity description..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="bg-orange-500 hover:bg-orange-600 text-white">
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Activity Dialog */}
        <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Add Activity - {selectedOpportunity?.lead_info?.company?.name}
              </DialogTitle>
              <DialogDescription>
                Record a new activity for this opportunity
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Activity Type</Label>
                  <Select
                    value={activityForm.type}
                    onValueChange={(value) =>
                      setActivityForm({ ...activityForm, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="demo">Demo</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={activityForm.date}
                    onChange={(e) =>
                      setActivityForm({ ...activityForm, date: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={activityForm.description}
                  onChange={(e) =>
                    setActivityForm({
                      ...activityForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Detailed description of what happened..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowActivityDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveActivity} className="bg-orange-500 hover:bg-orange-600 text-white rounded-md ">
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Send Proposal Dialog */}
        <Dialog open={showProposalDialog} onOpenChange={setShowProposalDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Send Proposal - {selectedOpportunity?.lead_info?.company?.name}
              </DialogTitle>
              <DialogDescription>
                Create and send a comprehensive proposal to advance this
                opportunity
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Proposal Title *</Label>
                <Input
                  value={proposalForm.title}
                  onChange={(e) =>
                    setProposalForm({ ...proposalForm, title: e.target.value })
                  }
                  placeholder="Enter proposal title..."
                />
              </div>
              <div>
                <Label>Proposal Description</Label>
                <Textarea
                  value={proposalForm.description}
                  onChange={(e) =>
                    setProposalForm({
                      ...proposalForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the proposed solution and key benefits..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Validity Period (Days)</Label>
                  <Select
                    value={proposalForm.validityPeriod}
                    onValueChange={(value) =>
                      setProposalForm({
                        ...proposalForm,
                        validityPeriod: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="45">45 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Delivery Method</Label>
                  <Select
                    value={proposalForm.deliveryMethod}
                    onValueChange={(value) =>
                      setProposalForm({
                        ...proposalForm,
                        deliveryMethod: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="secure_portal">
                        Secure Portal
                      </SelectItem>
                      <SelectItem value="in_person">
                        In-Person Presentation
                      </SelectItem>
                      <SelectItem value="video_call">
                        Video Call Presentation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Special Terms & Conditions</Label>
                <Textarea
                  value={proposalForm.specialTerms}
                  onChange={(e) =>
                    setProposalForm({
                      ...proposalForm,
                      specialTerms: e.target.value,
                    })
                  }
                  placeholder="Any special terms, conditions, or customizations for this proposal..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowProposalDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProposal}
                disabled={!proposalForm.title}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Send Proposal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* History Dialog */}
        <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Opportunity History -{" "}
                {selectedOpportunity?.lead_info?.company?.name}
              </DialogTitle>
              <DialogDescription>
                Complete activity and lead history for this opportunity
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] w-full">
              <div className="space-y-4 pr-4">
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-gray-400 mr-2" />
                    <span className="text-gray-500">Loading history...</span>
                  </div>
                ) : historyData && historyData.length > 0 ? (
                  historyData.map((historyItem) => (
                    <div key={historyItem.id} className="border-l-4 border-blue-200 pl-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {historyItem.history_type === 'activity' ? (
                              <Activity className="h-4 w-4 text-blue-600" />
                            ) : historyItem.icon === 'plus' ? (
                              <Plus className="h-4 w-4 text-green-600" />
                            ) : historyItem.icon === 'trending-up' ? (
                              <TrendingUp className="h-4 w-4 text-blue-600" />
                            ) : historyItem.icon === 'user' ? (
                              <User className="h-4 w-4 text-purple-600" />
                            ) : historyItem.icon === 'phone' ? (
                              <Phone className="h-4 w-4 text-orange-600" />
                            ) : historyItem.icon === 'mail' ? (
                              <Mail className="h-4 w-4 text-red-600" />
                            ) : historyItem.icon === 'file-text' ? (
                              <FileText className="h-4 w-4 text-gray-600" />
                            ) : (
                              <Clock className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                              {historyItem.action}
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {historyItem.details}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {historyItem.user_name}
                          </span>
                          <span>{historyItem.user_role}</span>
                        </div>
                        <span>{historyItem.formatted_timestamp}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No history available</p>
                    <p className="text-sm">No activity or history records found for this opportunity</p>
                  </div>
                )}
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button onClick={() => setShowHistoryDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
}