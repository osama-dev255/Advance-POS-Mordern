import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Package, 
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";

interface AssetsManagementProps {
  username: string;
  onBack: () => void;
  onLogout: () => void;
  onNavigate?: (view: string) => void;
}

export const AssetsManagement = ({ username, onBack, onLogout, onNavigate }: AssetsManagementProps) => {
  const [activeTab, setActiveTab] = useState<"buy" | "sell" | "history">("buy");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulate fetching transaction data
  useEffect(() => {
    if (activeTab === "history") {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        // Mock data - in a real app, this would come from an API
        const mockTransactions = [
          {
            id: 1,
            date: "2023-06-15",
            asset: "Office Computer",
            type: "Purchase",
            amount: 1200.00,
            status: "Completed"
          },
          {
            id: 2,
            date: "2023-05-22",
            asset: "Delivery Van",
            type: "Purchase",
            amount: 15000.00,
            status: "Completed"
          },
          {
            id: 3,
            date: "2023-04-10",
            asset: "Office Desk",
            type: "Sale",
            amount: 300.00,
            status: "Completed"
          },
          {
            id: 4,
            date: "2023-03-18",
            asset: "Printer",
            type: "Purchase",
            amount: 250.00,
            status: "Completed"
          },
          {
            id: 5,
            date: "2023-02-05",
            asset: "Conference Table",
            type: "Sale",
            amount: 450.00,
            status: "Completed"
          }
        ];
        setTransactions(mockTransactions);
        setLoading(false);
      }, 500);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Assets Management</h1>
              <p className="text-muted-foreground">Manage company assets and transactions</p>
            </div>
            <Button variant="outline" onClick={onBack}>
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Asset Transactions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Buying Asset Card */}
            <DashboardCard
              title="Buying Assets"
              description="Purchase new assets for your business"
              icon={TrendingDown}
              onClick={() => setActiveTab("buy")}
              className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
            />

            {/* Selling Asset Card */}
            <DashboardCard
              title="Selling Assets"
              description="Sell existing assets from your business"
              icon={TrendingUp}
              onClick={() => setActiveTab("sell")}
              className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
            />

            {/* Transaction History Card */}
            <DashboardCard
              title="Transaction History"
              description="View asset purchase and sale history"
              icon={Package}
              onClick={() => setActiveTab("history")}
              className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === "buy" 
                ? "Buy Assets" 
                : activeTab === "sell" 
                  ? "Sell Assets" 
                  : "Asset Transaction History"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeTab === "history" ? (
              // Transaction History Content
              <div className="py-4">
                {loading ? (
                  <div className="text-center py-8">
                    <p>Loading transaction history...</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.asset}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.type}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${transaction.amount.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {transaction.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Showing {transactions.length} of {transactions.length} transactions
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 rounded-md border border-gray-300 text-sm">Previous</button>
                        <button className="px-3 py-1 rounded-md border border-gray-300 text-sm">Next</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Buy/Sell Asset Content
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {activeTab === "buy" ? (
                    <ShoppingCart className="h-8 w-8 text-primary" />
                  ) : (
                    <DollarSign className="h-8 w-8 text-primary" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {activeTab === "buy" ? "Asset Purchase Management" : "Asset Sale Management"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === "buy" 
                    ? "Manage the purchase of new assets for your business" 
                    : "Manage the sale of existing business assets"}
                </p>
                <Button onClick={() => {
                  if (onNavigate) {
                    onNavigate(activeTab === "buy" ? "purchase-assets" : "sell-assets");
                  }
                }}>
                  {activeTab === "buy" ? "Start Purchasing Assets" : "Start Selling Assets"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};