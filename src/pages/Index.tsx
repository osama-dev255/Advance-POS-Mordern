import { useState, useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import RegisterPage from "./RegisterPage";
import { useAuth } from "@/contexts/AuthContext";
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

// Import FinanceDashboard, IncomeStatement, AssetsManagement, and CapitalManagement
import { FinanceDashboard } from "@/pages/FinanceDashboard";
import { IncomeStatement } from "@/pages/IncomeStatement";
import { AssetsManagement } from "@/pages/AssetsManagement";
import { CapitalManagement } from "@/pages/CapitalManagement";

import { 
  createAsset, 
  createAssetTransaction,
  getAssets,
  updateAsset
} from '@/services/databaseService';
import { formatCurrency } from '@/lib/currency';
import { uploadFile } from '@/utils/fileUploadUtils';

export const Index = () => {
  const [currentView, setCurrentView] = useState("splash");
  const [showSplash, setShowSplash] = useState(true);
  const [assets, setAssets] = useState<any[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const { user, login, logout } = useAuth();

  // Show splash screen for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setCurrentView("login");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Fetch assets when we navigate to sell-assets view
  useEffect(() => {
    const fetchAssets = async () => {
      if (currentView === "sell-assets" && user) {
        setLoadingAssets(true);
        try {
          const fetchedAssets = await getAssets();
          // Filter for active assets only
          const activeAssets = fetchedAssets.filter(asset => asset.status === 'active');
          setAssets(activeAssets);
        } catch (error) {
          console.error('Error fetching assets:', error);
        } finally {
          setLoadingAssets(false);
        }
      }
    };
    
    fetchAssets();
  }, [currentView, user]);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    const { username, password } = credentials;
    
    try {
      // Use AuthContext login function
      const result = await login(username, password);
      
      if (result.error) {
        // Check if it's an email confirmation error
        if (result.error.message && result.error.message.includes("Email not confirmed")) {
          console.warn("Email not confirmed. Please check email and confirm before logging in.");
        }
        // Don't fall back to mock authentication - just show error
        console.warn("Auth failed:", result.error);
        return;
      } else {
        // Auth successful
        
        // Get user role and redirect based on role
        if (result.user) {
          // For staff members, we need to check what modules they have access to
          if (result.user.email?.includes('staff')) {
            // Staff members should not have access to sales management
            // Redirect to comprehensive dashboard which will filter modules
            setCurrentView("comprehensive");
          } else {
            // For other roles, use the existing logic
            if (result.user.email?.includes('admin')) {
              setCurrentView("comprehensive");
            } else if (result.user.email?.includes('manager')) {
              setCurrentView("comprehensive");
            } else if (result.user.email?.includes('cashier')) {
              setCurrentView("sales");
            } else {
              // Default to comprehensive dashboard for unknown roles
              setCurrentView("comprehensive");
            }
          }
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    console.log("Logging out");
    try {
      // Use AuthContext logout function
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    // Reset state
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
      case "capital":
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
      case "purchase-assets":
      case "sell-assets":
        setCurrentView("assets");
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
  // Enhanced authentication check - ensure user is authenticated for all views except login and register
  if (currentView === "login" || !user) {
    console.log("Rendering LoginForm");
    return <LoginForm onLogin={handleLogin} onNavigate={handleNavigate} />;
  }
  
  if (currentView === "register") {
    console.log("Rendering RegisterPage");
    return <RegisterPage onBack={handleBack} />;
  }

  // Additional authentication check to ensure user hasn't been logged out
  if (!user) {
    console.log("User not authenticated, redirecting to login");
    setCurrentView("login");
    return <LoginForm onLogin={handleLogin} onNavigate={handleNavigate} />;
  }

  // Ensure that we don't render unauthorized views
  const authorizedViews = [
    "comprehensive", "dashboard", "sales", "sales-cart", "sales-orders", 
    "test-sales-orders", "products", "customers", "transactions", "analytics", 
    "sales-analytics", "spending-analytics", "employees", "purchase", 
    "purchase-terminal", "purchase-transactions", "purchase-reports", 
    "suppliers", "purchase-orders", "finance", "reports", "financial-reports",
    "taxes", "capital", "income-statement", "test", "test-qr", "assets",
    "purchase-assets", "sell-assets", "capital"
  ];

  if (!authorizedViews.includes(currentView)) {
    console.log(`Unauthorized view requested: ${currentView}, redirecting to comprehensive dashboard`);
    setCurrentView("comprehensive");
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
                  onNavigate={handleNavigate}
                />
              );
            case "purchase-assets":
              console.log("Rendering Purchase Assets page");
              // Ensure user is authenticated before rendering
              if (!user) {
                console.log("User not authenticated for purchase-assets, redirecting to login");
                setCurrentView("login");
                return <LoginForm onLogin={handleLogin} onNavigate={handleNavigate} />;
              }
              return (
                <div className="min-h-screen bg-background">
                  <header className="border-b">
                    <div className="container mx-auto px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-2xl font-bold">Purchase Assets</h1>
                          <p className="text-muted-foreground">Add new assets to your business</p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleBack();
                          }}
                          className="text-primary hover:underline px-4 py-2 border border-primary rounded-md"
                        >
                          ← Back to Assets
                        </button>
                      </div>
                    </div>
                  </header>
                  <main className="container mx-auto p-4 sm:p-6">
                    <div className="max-w-2xl mx-auto">
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Asset Purchase Form</h2>
                        <form className="space-y-4" onSubmit={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          // Get form data
                          const formData = new FormData(e.target as HTMLFormElement);
                          const assetData = {
                            name: formData.get('assetName') as string,
                            description: formData.get('description') as string || null,
                            category: formData.get('category') as string || null,
                            purchase_date: formData.get('purchaseDate') as string || null,
                            purchase_price: parseFloat(formData.get('purchasePrice') as string),
                            current_value: parseFloat(formData.get('purchasePrice') as string),
                            depreciation_rate: 0.00,
                            estimated_lifespan: parseInt(formData.get('lifespan') as string) || null,
                            status: 'active' as const,
                            serial_number: null,
                            location: formData.get('location') as string || null,
                            notes: formData.get('notes') as string || null
                          };
                          
                          try {
                            // Create asset
                            const createdAsset = await createAsset(assetData);
                            if (!createdAsset) {
                              throw new Error('Failed to create asset');
                            }
                            
                            // Handle file upload if provided
                            let attachmentUrl = null;
                            const attachmentFile = formData.get('attachment') as File;
                            if (attachmentFile && attachmentFile.size > 0) {
                              // Upload the file to Supabase storage
                              attachmentUrl = await uploadFile(attachmentFile, 'assets', 'purchase_attachments');
                              if (!attachmentUrl) {
                                console.warn('Failed to upload attachment file');
                              }
                            }
                            
                            // Create asset transaction
                            const transactionData = {
                              asset_id: createdAsset.id,
                              transaction_type: 'purchase' as const,
                              transaction_date: assetData.purchase_date || new Date().toISOString().split('T')[0],
                              amount: assetData.purchase_price,
                              description: `Purchase of ${assetData.name}`,
                              buyer_seller: 'Self',
                              notes: attachmentUrl || null,
                              reference_number: null
                            };
                            
                            const createdTransaction = await createAssetTransaction(transactionData);
                            if (!createdTransaction) {
                              throw new Error('Failed to create asset transaction');
                            }
                            
                            alert('Asset purchased successfully!');
                            handleBack();
                          } catch (error) {
                            console.error('Error purchasing asset:', error);
                            alert('Error purchasing asset. Please try again.');
                          }
                        }}>
                          <div>
                            <label className="block text-sm font-medium mb-1">Asset Name</label>
                            <input 
                              type="text" 
                              name="assetName"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Enter asset name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea 
                              name="description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Enter asset description"
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Purchase Date</label>
                              <input 
                                type="date" 
                                name="purchaseDate"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Purchase Price</label>
                              <input 
                                type="number" 
                                name="purchasePrice"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter purchase price"
                                step="0.01"
                                min="0"
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Category</label>
                              <select 
                                name="category"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                              >
                                <option value="">Select category</option>
                                <option value="equipment">Equipment</option>
                                <option value="vehicles">Vehicles</option>
                                <option value="furniture">Furniture</option>
                                <option value="technology">Technology</option>
                                <option value="property">Property</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Estimated Lifespan (years)</label>
                              <input 
                                type="number" 
                                name="lifespan"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter lifespan"
                                min="1"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input 
                              type="text" 
                              name="location"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Enter asset location"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Notes</label>
                            <textarea 
                              name="notes"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Additional notes about the asset"
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Attachment (Receipt, Invoice, etc.)</label>
                            <input 
                              type="file"
                              name="attachment"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              accept="image/*,application/pdf"
                            />
                            <p className="text-xs text-gray-500 mt-1">Upload receipt, invoice, or other supporting documents</p>
                          </div>
                          <div className="flex justify-end space-x-3 pt-4">
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleBack();
                              }}
                              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit"
                              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                            >
                              Purchase Asset
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </main>
                </div>
              );
            case "sell-assets":
              console.log("Rendering Sell Assets page");
              // Ensure user is authenticated before rendering
              if (!user) {
                console.log("User not authenticated for sell-assets, redirecting to login");
                setCurrentView("login");
                return <LoginForm onLogin={handleLogin} onNavigate={handleNavigate} />;
              }
              
              // Show loading state
              if (loadingAssets) {
                return (
                  <div className="min-h-screen bg-background">
                    <header className="border-b">
                      <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h1 className="text-2xl font-bold">Sell Assets</h1>
                            <p className="text-muted-foreground">Sell existing business assets</p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleBack();
                            }}
                            className="text-primary hover:underline px-4 py-2 border border-primary rounded-md"
                          >
                            ← Back to Assets
                          </button>
                        </div>
                      </div>
                    </header>
                    <main className="container mx-auto p-4 sm:p-6">
                      <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                          <p>Loading assets...</p>
                        </div>
                      </div>
                    </main>
                  </div>
                );
              }
              
              return (
                <div className="min-h-screen bg-background">
                  <header className="border-b">
                    <div className="container mx-auto px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-2xl font-bold">Sell Assets</h1>
                          <p className="text-muted-foreground">Sell existing business assets</p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleBack();
                          }}
                          className="text-primary hover:underline px-4 py-2 border border-primary rounded-md"
                        >
                          ← Back to Assets
                        </button>
                      </div>
                    </div>
                  </header>
                  <main className="container mx-auto p-4 sm:p-6">
                    <div className="max-w-2xl mx-auto">
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Asset Sale Form</h2>
                        <form className="space-y-4" onSubmit={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          // Get form data
                          const formData = new FormData(e.target as HTMLFormElement);
                          const transactionData = {
                            asset_id: formData.get('assetId') as string,
                            transaction_type: 'sale' as const,
                            transaction_date: formData.get('saleDate') as string,
                            amount: parseFloat(formData.get('salePrice') as string),
                            description: formData.get('description') as string || null,
                            buyer_seller: formData.get('buyer') as string,
                            notes: formData.get('notes') as string || null,
                            reference_number: null
                          };
                          
                          try {
                            // Handle file upload if provided
                            let attachmentUrl = null;
                            const attachmentFile = formData.get('attachment') as File;
                            if (attachmentFile && attachmentFile.size > 0) {
                              // Upload the file to Supabase storage
                              attachmentUrl = await uploadFile(attachmentFile, 'assets', 'sale_attachments');
                              if (!attachmentUrl) {
                                console.warn('Failed to upload attachment file');
                              }
                            }
                            
                            // Add attachment URL to transaction notes if available
                            if (attachmentUrl) {
                              transactionData.notes = transactionData.notes 
                                ? `${transactionData.notes} | Attachment: ${attachmentUrl}`
                                : `Attachment: ${attachmentUrl}`;
                            }
                            
                            // Create asset transaction
                            const createdTransaction = await createAssetTransaction(transactionData);
                            if (!createdTransaction) {
                              throw new Error('Failed to create asset transaction');
                            }
                            
                            // Update asset status to 'sold'
                            const updatedAsset = await updateAsset(transactionData.asset_id, { status: 'sold' });
                            if (!updatedAsset) {
                              console.warn('Failed to update asset status to sold');
                            }
                            
                            alert('Asset sold successfully!');
                            handleBack();
                          } catch (error) {
                            console.error('Error selling asset:', error);
                            alert('Error selling asset. Please try again.');
                          }
                        }}>
                          <div>
                            <label className="block text-sm font-medium mb-1">Select Asset</label>
                            <select 
                              name="assetId"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            >
                              <option value="">Select an asset to sell</option>
                              {assets.map(asset => (
                                <option key={asset.id} value={asset.id}>
                                  {asset.name} - {formatCurrency(asset.current_value)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Sale Date</label>
                              <input 
                                type="date" 
                                name="saleDate"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Sale Price</label>
                              <input 
                                type="number" 
                                name="salePrice"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter sale price"
                                step="0.01"
                                min="0"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Buyer Information</label>
                            <input 
                              type="text" 
                              name="buyer"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Enter buyer name or company"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea 
                              name="description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Enter sale description"
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Notes</label>
                            <textarea 
                              name="notes"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Additional notes about the sale"
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Attachment (Receipt, Invoice, etc.)</label>
                            <input 
                              type="file"
                              name="attachment"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              accept="image/*,application/pdf"
                            />
                            <p className="text-xs text-gray-500 mt-1">Upload receipt, invoice, or other supporting documents</p>
                          </div>
                          <div className="flex justify-end space-x-3 pt-4">
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleBack();
                              }}
                              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit"
                              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                            >
                              Sell Asset
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </main>
                </div>
              );
            case "capital":
              console.log("Rendering CapitalManagement");
              return (
                <CapitalManagement
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