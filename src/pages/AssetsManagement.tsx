import { useState } from "react";
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
}

export const AssetsManagement = ({ username, onBack, onLogout }: AssetsManagementProps) => {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === "buy" ? "Buy Assets" : "Sell Assets"}
            </CardTitle>
          </CardHeader>
          <CardContent>
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
              <Button>
                {activeTab === "buy" ? "Start Purchasing Assets" : "Start Selling Assets"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};