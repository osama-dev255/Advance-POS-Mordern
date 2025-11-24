import { useState, useEffect } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Wallet, 
  Truck,
  Settings,
  User,
  Shield,
  FileText,
  Bot,
  Scan,
  AlertTriangle,
  Printer,
  Building
} from "lucide-react";
import { hasModuleAccess, getCurrentUserRole } from "@/utils/salesPermissionUtils";

interface Module {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

interface ComprehensiveDashboardProps {
  username: string;
  onNavigate: (module: string) => void;
  onLogout: () => void;
}

export const ComprehensiveDashboard = ({ username, onNavigate, onLogout }: ComprehensiveDashboardProps) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getCurrentUserRole();
      setUserRole(role);
    };
    
    fetchUserRole();
  }, []);

  const allModules: Module[] = [
    {
      id: "inventory",
      title: "Inventory Management",
      description: "Manage products, stock levels, categories, and inventory tracking",
      icon: Package,
      color: "bg-white border border-gray-200"
    },
    {
      id: "sales",
      title: "Sales Dashboard",
      description: "Process sales, manage transactions, and view sales analytics",
      icon: ShoppingCart,
      color: "bg-white border border-gray-200"
    },
    {
      id: "purchase",
      title: "Purchase Management",
      description: "Handle supplier orders, track purchases, and manage vendors",
      icon: Truck,
      color: "bg-white border border-gray-200"
    },
    {
      id: "finance",
      title: "Financial Management",
      description: "Manage expenses, debts, and financial reporting",
      icon: Wallet,
      color: "bg-white border border-gray-200"
    },
    {
      id: "customers",
      title: "Customer Management",
      description: "Manage customer information and loyalty programs",
      icon: Users,
      color: "bg-white border border-gray-200"
    },
    {
      id: "suppliers",
      title: "Supplier Management",
      description: "Manage supplier information and vendor relationships",
      icon: Truck,
      color: "bg-white border border-gray-200"
    },
    {
      id: "employees",
      title: "Employee Management",
      description: "Manage staff members and permissions",
      icon: User,
      color: "bg-white border border-gray-200"
    },
    {
      id: "analytics",
      title: "Business Analytics",
      description: "View detailed sales reports and business performance metrics",
      icon: BarChart3,
      color: "bg-white border border-gray-200"
    },
    {
      id: "expenses",
      title: "Expense Tracking",
      description: "Track business expenses and categorize spending",
      icon: Wallet,
      color: "bg-white border border-gray-200"
    },
    {
      id: "returns",
      title: "Returns Management",
      description: "Process product returns and refunds",
      icon: Package,
      color: "bg-white border border-gray-200"
    },
    {
      id: "debts",
      title: "Debt Management",
      description: "Track customer debts and payment schedules",
      icon: Wallet,
      color: "bg-white border border-gray-200"
    },
    {
      id: "customer-settlements",
      title: "Customer Settlements",
      description: "Manage customer debt settlements and payments",
      icon: Users,
      color: "bg-white border border-gray-200"
    },
    {
      id: "supplier-settlements",
      title: "Supplier Settlements",
      description: "Manage supplier payments and settlements",
      icon: Truck,
      color: "bg-white border border-gray-200"
    },
    {
      id: "reports",
      title: "Reports & Analytics",
      description: "View financial reports and business analytics",
      icon: BarChart3,
      color: "bg-white border border-gray-200"
    },
    {
      id: "access-logs",
      title: "Access Logs",
      description: "Monitor user activity and system access",
      icon: Shield,
      color: "bg-white border border-gray-200"
    },
    {
      id: "settings",
      title: "System Settings",
      description: "Configure POS system preferences and options",
      icon: Settings,
      color: "bg-white border border-gray-200"
    },
    {
      id: "scanner",
      title: "Scan Items",
      description: "Quickly add products using barcode scanner",
      icon: Scan,
      color: "bg-white border border-gray-200"
    },
    {
      id: "automated",
      title: "Automated Dashboard",
      description: "View automated business insights and recommendations",
      icon: Bot,
      color: "bg-white border border-gray-200"
    },
    {
      id: "assets",
      title: "Assets Management",
      description: "Manage company assets, depreciation, and asset tracking",
      icon: Building,
      color: "bg-white border border-gray-200"
    }
  ];

  // Filter modules based on user role
  const modules = allModules.filter(module => hasModuleAccess(userRole, module.id));

  const handleNavigate = async (moduleId: string) => {
    // Special handling for reports module
    if (moduleId === "reports") {
      console.log("Reports module clicked");
      onNavigate("statements-reports");
      return;
    }
    // Special handling for financial statements module
    if (moduleId === "financial-statements") {
      console.log("Financial statements module clicked");
      onNavigate("financial-reports");
      return;
    }
    onNavigate(moduleId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main content without Navigation since it's now in AdvancedLayout */}
      <main className="container mx-auto p-4 sm:p-6">
        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">Welcome back, {username}!</h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Select a module to manage your business operations
          </p>
        </div>
        
        {modules.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 auto-rows-fr">
            {modules.map((module) => (
              <div key={module.id} className="flex">
                <DashboardCard
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  onClick={() => {
                    console.log("Module clicked:", module.id);
                    handleNavigate(module.id);
                  }}
                  className={module.color}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Access</h3>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access any modules.
            </p>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Logout
            </button>
          </div>
        )}
      </main>
    </div>
  );
};