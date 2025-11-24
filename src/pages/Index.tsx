import { useState, useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import RegisterPage from "./RegisterPage";
import { Dashboard } from "@/pages/Dashboard";
import { SalesDashboard } from "@/pages/SalesDashboard";
import { SalesCart } from "@/pages/SalesCart";
import { SalesOrders } from "@/pages/SalesOrders";
import { TestSalesOrders } from "@/pages/TestSalesOrders";
import { ProductManagement } from "@/pages/ProductManagement";
import { CustomerManagement } from "@/pages/CustomerManagement";
import { TransactionHistory } from "@/pages/TransactionHistory";
import { SalesAnalytics } from "@/pages/SalesAnalytics";
import { SpendingAnalytics } from "@/pages/SpendingAnalytics";
import { EmployeeManagement } from "@/pages/EmployeeManagement";
import { SupplierManagement } from "@/pages/SupplierManagement";
import { PurchaseOrders } from "@/pages/PurchaseOrders";
import { PurchaseDashboard } from "@/pages/PurchaseDashboard";
import { PurchaseTerminal } from "@/pages/PurchaseTerminal";
import { PurchaseTransactionHistory } from "@/pages/PurchaseTransactionHistory";
import { PurchaseReports } from "@/pages/PurchaseReports";
import { ExpenseManagement } from "@/pages/ExpenseManagement";
import { ReturnsManagement } from "@/pages/ReturnsManagement";
import { DebtManagement } from "@/pages/DebtManagement";
import { CustomerSettlements } from "@/pages/CustomerSettlements";
import { SupplierSettlements } from "@/pages/SupplierSettlements";
import { DiscountManagement } from "@/pages/DiscountManagement";
import { InventoryAudit } from "@/pages/InventoryAudit";
import { AccessLogs } from "@/pages/AccessLogs";
import { ComprehensiveDashboard } from "@/pages/ComprehensiveDashboard";
import { Reports } from "@/pages/Reports";
import { FinancialReports } from "@/pages/FinancialReports";
import { TaxManagement } from "@/pages/TaxManagement";
import { TestPage } from "@/pages/TestPage";
import { TestReceiptQR } from "@/pages/TestReceiptQR";
import { SplashScreen } from "@/components/SplashScreen";
import { AdvancedLayout } from "@/components/AdvancedLayout";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "@/services/authService";

// Import FinanceDashboard, IncomeStatement, and AssetsManagement
import { FinanceDashboard } from "@/pages/FinanceDashboard";
import { IncomeStatement } from "@/pages/IncomeStatement";
import { AssetsManagement } from "@/pages/AssetsManagement";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const Index = () => {
  const [currentView, setCurrentView] = useState("splash");
  const [user, setUser] = useState<any>(null);
  const [showSplash, setShowSplash] = useState(true);

  // Show splash screen for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setCurrentView("login");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    const { username, password } = credentials;
    console.log("Attempting login with:", username);
    
    try {
      // First try Supabase authentication
      const result = await supabase.auth.signInWithPassword({
        email: username,
        password,
      });
      
      if (result.error) {
        // Check if it's an email confirmation error
        if (result.error.message.includes("Email not confirmed")) {
          console.warn("Email not confirmed. Please check email and confirm before logging in.");
        }
        // Don't fall back to mock authentication - just show error
        console.warn("Supabase auth failed:", result.error);
        return;
      } else {
        // Supabase auth successful
        console.log("Supabase auth successful:", result);
        
        // Get user role and redirect based on role
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          // For staff members, we need to check what modules they have access to
          if (currentUser.email?.includes('staff')) {
            // Staff members should not have access to sales management
            // Redirect to comprehensive dashboard which will filter modules
            setCurrentView("comprehensive");
          } else {
            // For other roles, use the existing logic
            switch (currentUser.email) {
              case currentUser.email?.includes('admin') ? currentUser.email : '':
                setCurrentView("comprehensive");
                break;
              case currentUser.email?.includes('manager') ? currentUser.email : '':
                setCurrentView("comprehensive");
                break;
              case currentUser.email?.includes('cashier') ? currentUser.email : '':
                setCurrentView("sales");
                break;
              default:
                // Default to comprehensive dashboard for unknown roles
                setCurrentView("comprehensive");
            }
          }
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }

    // Set user regardless of auth method
    setUser({ email: credentials.username });
  };

  const handleLogout = async () => {
    console.log("Logging out");
    try {
      // Logout from Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Supabase logout error:", error);
    }
    
    // Reset state
    setUser(null);
    setCurrentView("login");
  };

  const handleNavigate = (view: string) => {
    console.log("Navigating to:", view);
    setCurrentView(view);
  };

  const handleBack = () => {
    console.log("Going back from:", currentView);
    // Navigation logic for going back
    switch (currentView) {
      case "register":
        setCurrentView("login");
        break;
      case "dashboard":
        setCurrentView("comprehensive");
        break;
      case "sales":
        setCurrentView("comprehensive");
        break;
      case "sales-cart":
        setCurrentView("sales");
        break;
      case "sales-orders":
        setCurrentView("sales");
        break;
      case "test-sales-orders":
        setCurrentView("sales");
        break;
      case "products":
        setCurrentView("comprehensive");
        break;
      case "customers":
        setCurrentView("comprehensive");
        break;
      case "transactions":
        setCurrentView("comprehensive");
        break;
      case "analytics":
      case "sales-analytics":
        setCurrentView("sales");
        break;
      case "spending-analytics":
        setCurrentView("finance");
        break;
      case "employees":
        setCurrentView("comprehensive");
        break;
      case "purchase":
        setCurrentView("comprehensive");
        break;
      case "purchase-terminal":
        setCurrentView("purchase");
        break;
      case "purchase-transactions":
        setCurrentView("purchase");
        break;
      case "purchase-reports":
        setCurrentView("purchase");
        break;
      case "suppliers":
        setCurrentView("purchase");
        break;
      case "purchase-orders":
        setCurrentView("purchase");
        break;
      case "finance":
        setCurrentView("comprehensive");
        break;
      case "statements-reports":
        setCurrentView("finance");
        break;
      case "financial-reports":
        setCurrentView("finance");
        break;
      case "expenses":
        setCurrentView("finance");
        break;
      case "returns":
        setCurrentView("sales");
        break;
      case "debts":
        setCurrentView("finance");
        break;
      case "customer-settlements":
        setCurrentView("finance");
        break;
      case "supplier-settlements":
        setCurrentView("finance");
        break;
      case "discounts":
        setCurrentView("sales");
        break;
      case "audit":
        setCurrentView("comprehensive");
        break;
      case "access-logs":
        setCurrentView("comprehensive");
        break;
      case "comprehensive":
        setCurrentView("login");
        break;
      case "reports":
        // Show financial management dashboard instead of going directly to reports
        setCurrentView("finance");
        break;
      case "financial-reports":
        // Show financial reports page
        setCurrentView("financial-reports");
        break;
      case "taxes":
        setCurrentView("finance");
        break;
      case "income-statement":
        setCurrentView("financial-reports");
        break;
      case "test":
        setCurrentView("comprehensive");
        break;
      case "test-qr":
        setCurrentView("test");
        break;
      case "assets":
        setCurrentView("comprehensive");
        break;
      default:
        setCurrentView("comprehensive");
    }
  };

  // Async version of handleBack for components that need to await navigation
  const handleBackAsync = async () => {
    handleBack();
  };

  // Show splash screen first, then login form
  if (showSplash) {
    return <SplashScreen />;
  }

  console.log("Rendering Index, currentView:", currentView, "user:", user);
  if (currentView === "login" || !user) {
    console.log("Rendering LoginForm");
    return <LoginForm onLogin={handleLogin} onNavigate={handleNavigate} />;
  }
  
  if (currentView === "register") {
    console.log("Rendering RegisterPage");
    return <RegisterPage onBack={handleBack} />;
  }

  // Render with AdvancedLayout for all other views
  return (
    <AdvancedLayout 
      username={user?.email || "admin"} 
      onLogout={handleLogout}
      currentView={currentView}
      onNavigate={handleNavigate}
    >
      {(() => {
          console.log("Rendering currentView:", currentView);
          switch (currentView) {
            case "comprehensive":
              console.log("Rendering ComprehensiveDashboard");
              return (
                <ComprehensiveDashboard
                  username={user?.email || "admin"}
                  onNavigate={handleNavigate}
                  onLogout={handleLogout}
                />
              );
            case "dashboard":
              console.log("Rendering Dashboard");
              return (
                <Dashboard
                  username={user?.email || "admin"}
                  onNavigate={handleNavigate}
                  onLogout={handleLogout}
                />
              );
            case "sales":
              console.log("Rendering SalesDashboard");
              return (
                <SalesDashboard
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                  onNavigate={handleNavigate}
                />
              );
            case "sales-cart":
              console.log("Rendering SalesCart");
              return (
                <SalesCart
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                  autoOpenScanner={true}
                />
              );
            case "sales-orders":
              console.log("Rendering SalesOrders");
              return (
                <SalesOrders
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "test-sales-orders":
              console.log("Rendering TestSalesOrders");
              return (
                <TestSalesOrders
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "products":
              console.log("Rendering ProductManagement");
              return (
                <ProductManagement
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "customers":
              console.log("Rendering CustomerManagement");
              return (
                <CustomerManagement
                  username={user?.email || "admin"}
                  onBack={handleBackAsync}
                  onLogout={handleLogout}
                />
              );
            case "transactions":
              console.log("Rendering TransactionHistory");
              return (
                <TransactionHistory
                  username={user?.email || "admin"}
                  onBack={handleBackAsync}
                  onLogout={handleLogout}
                />
              );
            case "analytics":
            case "sales-analytics":
              console.log("Rendering SalesAnalytics");
              return (
                <SalesAnalytics
                  username={user?.email || "admin"}
                  onBack={handleBackAsync}
                  onLogout={handleLogout}
                />
              );
            case "spending-analytics":
              console.log("Rendering SpendingAnalytics");
              return (
                <SpendingAnalytics
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "employees":
              console.log("Rendering EmployeeManagement");
              return (
                <EmployeeManagement
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "purchase":
              console.log("Rendering PurchaseDashboard");
              return (
                <PurchaseDashboard
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                  onNavigate={handleNavigate}
                />
              );
            case "purchase-terminal":
              console.log("Rendering PurchaseTerminal");
              return (
                <PurchaseTerminal
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "purchase-transactions":
              console.log("Rendering PurchaseTransactionHistory");
              return (
                <PurchaseTransactionHistory
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "purchase-reports":
              console.log("Rendering PurchaseReports");
              return (
                <PurchaseReports
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "suppliers":
              console.log("Rendering SupplierManagement");
              return (
                <SupplierManagement
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "purchase-orders":
              console.log("Rendering PurchaseOrders");
              return (
                <PurchaseOrders
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "finance":
              console.log("Rendering FinanceDashboard");
              return (
                <FinanceDashboard
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                  onNavigate={handleNavigate}
                />
              );
            case "statements-reports":
              console.log("Rendering Reports");
              return (
                <Reports
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "expenses":
              console.log("Rendering ExpenseManagement");
              return (
                <ExpenseManagement
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "returns":
              console.log("Rendering ReturnsManagement");
              return (
                <ReturnsManagement
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "debts":
              console.log("Rendering DebtManagement");
              return (
                <DebtManagement
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "customer-settlements":
              console.log("Rendering CustomerSettlements");
              return (
                <CustomerSettlements
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "supplier-settlements":
              console.log("Rendering SupplierSettlements");
              return (
                <SupplierSettlements
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "discounts":
              console.log("Rendering DiscountManagement");
              return (
                <DiscountManagement
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "audit":
              console.log("Rendering InventoryAudit");
              return (
                <InventoryAudit
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "access-logs":
              console.log("Rendering AccessLogs");
              return (
                <AccessLogs
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "reports":
              console.log("Rendering Reports");
              return (
                <Reports
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "financial-reports":
              console.log("Rendering FinancialReports");
              return (
                <FinancialReports
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                  onNavigate={handleNavigate}
                />
              );
            case "taxes":
              console.log("Rendering TaxManagement");
              return (
                <TaxManagement
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "income-statement":
              console.log("Rendering IncomeStatement");
              return (
                <IncomeStatement
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            case "test":
              console.log("Rendering TestPage");
              return (
                <TestPage />
              );
            case "test-qr":
              console.log("Rendering TestReceiptQR");
              return (
                <TestReceiptQR />
              );
            case "assets":
              console.log("Rendering AssetsManagement");
              return (
                <AssetsManagement
                  username={user?.email || "admin"}
                  onBack={handleBack}
                  onLogout={handleLogout}
                />
              );
            default:
              console.log("Rendering default fallback for:", currentView);
              return (
                <div className="min-h-screen flex items-center justify-center bg-background">
                  <div className="text-center p-6 max-w-md">
                    <h1 className="text-2xl font-bold mb-4">
                      {String(currentView).charAt(0).toUpperCase() + String(currentView).slice(1)} Dashboard
                    </h1>
                    <p className="text-muted-foreground mb-4">This module is coming soon!</p>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleBack();
                      }}
                      className="text-primary hover:underline px-4 py-2 border border-primary rounded-md"
                    >
                      ← Back to Dashboard
                    </button>
                  </div>
                </div>
              );
          }
        })()}

    </AdvancedLayout>
  );
};

export default Index;