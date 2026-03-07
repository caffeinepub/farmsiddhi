import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  BarChart3,
  Loader2,
  MapPin,
  Package,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { MandiPrice } from "../backend";
import {
  useAddMandiPriceSeed,
  useGetAllMandiPrices,
} from "../hooks/useQueries";
import { mandiBanner } from "../lib/imageRegistry";

const COMMODITY_OPTIONS = [
  { value: "all", label: "All Commodities" },
  { value: "Rice", label: "Rice" },
  { value: "Wheat", label: "Wheat" },
  { value: "Flour", label: "Flour" },
  { value: "Dal", label: "Dal / Pulses" },
  { value: "Spices", label: "Spices" },
  { value: "Processed Food", label: "Processed Food" },
  { value: "Makhana", label: "Makhana" },
];

const STATE_OPTIONS = [
  { value: "all", label: "All States" },
  { value: "Bihar", label: "Bihar" },
  { value: "Delhi", label: "Delhi" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Kerala", label: "Kerala" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Telangana", label: "Telangana" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "West Bengal", label: "West Bengal" },
];

const CATEGORY_COLORS: Record<string, string> = {
  rice: "bg-amber-100 text-amber-800",
  wheat: "bg-yellow-100 text-yellow-800",
  pulses: "bg-orange-100 text-orange-800",
  spices: "bg-red-100 text-red-800",
  "processed-food-products": "bg-blue-100 text-blue-800",
  makhana: "bg-green-100 text-green-800",
};

function formatTimestamp(ts: bigint): string {
  try {
    const ms = Number(ts);
    if (!ms || ms === 0) return "N/A";
    const date = new Date(ms);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
}

function getModalPriceColor(price: number, allPrices: number[]): string {
  if (allPrices.length === 0) return "text-foreground";
  const sorted = [...allPrices].sort((a, b) => a - b);
  const low = sorted[Math.floor(sorted.length * 0.33)];
  const high = sorted[Math.floor(sorted.length * 0.66)];
  if (price <= low) return "text-green-700 font-semibold";
  if (price <= high) return "text-amber-700 font-semibold";
  return "text-red-700 font-semibold";
}

function PriceStatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card className="border-border">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {label}
            </p>
            <p className="text-lg font-bold text-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MandiTracking() {
  const [selectedCommodity, setSelectedCommodity] = useState("all");
  const [selectedState, setSelectedState] = useState("all");

  const {
    data: allPrices = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllMandiPrices();
  const seedMutation = useAddMandiPriceSeed();

  const filteredPrices = useMemo<MandiPrice[]>(() => {
    return allPrices.filter((item) => {
      const commodityMatch =
        selectedCommodity === "all" || item.commodity === selectedCommodity;
      const stateMatch =
        selectedState === "all" || item.state === selectedState;
      return commodityMatch && stateMatch;
    });
  }, [allPrices, selectedCommodity, selectedState]);

  const allModalPrices = useMemo(
    () => filteredPrices.map((p) => p.modalPrice),
    [filteredPrices],
  );

  const stats = useMemo(() => {
    if (filteredPrices.length === 0) return null;
    const modals = filteredPrices.map((p) => p.modalPrice);
    const avg = modals.reduce((a, b) => a + b, 0) / modals.length;
    const min = Math.min(...modals);
    const max = Math.max(...modals);
    return { avg, min, max, count: filteredPrices.length };
  }, [filteredPrices]);

  const handleSeed = () => {
    seedMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Market data loaded successfully!");
      },
      onError: () => {
        toast.error(
          "Failed to load market data. Admin permissions may be required.",
        );
      },
    });
  };

  const hasData = allPrices.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <img
          src={mandiBanner}
          alt="Live Mandi Prices"
          className="w-full h-48 md:h-64 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent flex items-center">
          <div className="section-container">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-medium">
                LIVE MARKET DATA
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Live Mandi Prices
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              Track commodity prices from major Indian agricultural markets
              (mandis) across all states.
            </p>
          </div>
        </div>
      </section>

      <div className="section-container py-8">
        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <PriceStatCard
              label="Total Records"
              value={String(stats.count)}
              icon={BarChart3}
              color="bg-primary/10 text-primary"
            />
            <PriceStatCard
              label="Avg Modal Price"
              value={`₹${stats.avg.toFixed(0)}`}
              icon={TrendingUp}
              color="bg-secondary/20 text-secondary-foreground"
            />
            <PriceStatCard
              label="Lowest Price"
              value={`₹${stats.min.toFixed(0)}`}
              icon={Package}
              color="bg-green-100 text-green-700"
            />
            <PriceStatCard
              label="Highest Price"
              value={`₹${stats.max.toFixed(0)}`}
              icon={MapPin}
              color="bg-red-100 text-red-700"
            />
          </div>
        )}

        {/* Filter Bar */}
        <Card className="border-border mb-6">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-base font-semibold text-foreground">
              Filter Prices
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <Select
                  value={selectedCommodity}
                  onValueChange={setSelectedCommodity}
                >
                  <SelectTrigger className="w-full sm:w-52">
                    <SelectValue placeholder="All Commodities" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMODITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="w-full sm:w-52">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="gap-2"
                  data-ocid="mandi.secondary_button"
                >
                  {isFetching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh
                </Button>

                <Button
                  size="sm"
                  variant={hasData ? "outline" : "default"}
                  onClick={handleSeed}
                  disabled={seedMutation.isPending}
                  className="gap-2"
                  data-ocid="mandi.primary_button"
                >
                  {seedMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <TrendingUp className="h-4 w-4" />
                  )}
                  {hasData ? "Reload Data" : "Load Market Data"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">
              Fetching mandi prices…
            </p>
          </div>
        ) : isError ? (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="flex items-center gap-3 py-8 justify-center">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <p className="text-destructive font-medium">
                Failed to load mandi prices. Please try refreshing.
              </p>
            </CardContent>
          </Card>
        ) : !hasData ? (
          <Card className="border-border">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-1">
                  No Market Data Available
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Click "Load Market Data" above to populate indicative mandi
                  prices from major Indian markets.
                </p>
              </div>
              <Button
                onClick={handleSeed}
                disabled={seedMutation.isPending}
                className="gap-2 mt-2"
              >
                {seedMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
                Load Market Data
              </Button>
            </CardContent>
          </Card>
        ) : filteredPrices.length === 0 ? (
          <Card className="border-border">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <Package className="h-7 w-7 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-1">
                  No Results Found
                </h3>
                <p className="text-muted-foreground text-sm">
                  No mandi prices match the selected filters. Try adjusting your
                  commodity or state selection.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCommodity("all");
                  setSelectedState("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="font-semibold text-foreground whitespace-nowrap">
                      Commodity
                    </TableHead>
                    <TableHead className="font-semibold text-foreground whitespace-nowrap">
                      Variety
                    </TableHead>
                    <TableHead className="font-semibold text-foreground whitespace-nowrap">
                      Market
                    </TableHead>
                    <TableHead className="font-semibold text-foreground whitespace-nowrap">
                      State
                    </TableHead>
                    <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">
                      Min Price
                    </TableHead>
                    <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">
                      Max Price
                    </TableHead>
                    <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">
                      Modal Price
                    </TableHead>
                    <TableHead className="font-semibold text-foreground whitespace-nowrap">
                      Unit
                    </TableHead>
                    <TableHead className="font-semibold text-foreground whitespace-nowrap">
                      Last Updated
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrices.map((item) => (
                    <TableRow
                      key={Number(item.id)}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-700"}`}
                        >
                          {item.commodity}
                        </span>
                      </TableCell>
                      <TableCell className="text-foreground font-medium">
                        {item.variety}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.market}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-muted-foreground text-sm">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          {item.state}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        ₹{item.minPrice.toFixed(0)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        ₹{item.maxPrice.toFixed(0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={getModalPriceColor(
                            item.modalPrice,
                            allModalPrices,
                          )}
                        >
                          ₹{item.modalPrice.toFixed(0)}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {item.unit}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {formatTimestamp(item.lastUpdated)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="px-4 py-2 border-t border-border bg-muted/20 text-xs text-muted-foreground">
              Showing {filteredPrices.length} of {allPrices.length} records
            </div>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Disclaimer:</strong> All prices
            shown are indicative and sourced from AGMARKNET-style market data.
            Actual mandi prices may vary based on quality, season, and local
            market conditions. FarmSiddhi does not guarantee the accuracy or
            timeliness of this data. Please verify prices with your local mandi
            before making any trading decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
