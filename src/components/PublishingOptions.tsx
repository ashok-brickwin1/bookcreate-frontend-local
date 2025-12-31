import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  Globe, 
  BookOpen, 
  Printer,
  ExternalLink,
  Check,
  Plus,
  Trash2,
  DollarSign,
  Tag,
  Languages,
  ShoppingCart,
  FileText,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketplaceLink {
  platform: string;
  url: string;
  status: 'active' | 'pending' | 'removed';
}

interface PublishingOptionsProps {
  bookTitle: string;
  onExportPDF: () => void;
  onExportEPUB: () => void;
  onExportPrintReady: () => void;
  isExporting?: boolean;
}

const distributionServices = [
  {
    id: 'draft2digital',
    name: 'Draft2Digital',
    description: 'Free distribution to Amazon, Apple, B&N, Kobo & 20+ retailers',
    features: ['Free to use', 'Wide distribution', 'Print-on-demand', 'Free ISBNs'],
    url: 'https://draft2digital.com',
    logo: '📚'
  },
  {
    id: 'ingramspark',
    name: 'IngramSpark',
    description: 'Professional distribution to 40,000+ retailers & libraries',
    features: ['Bookstore access', 'Library distribution', 'Global reach', 'Returns program'],
    url: 'https://ingramspark.com',
    logo: '🌐'
  },
  {
    id: 'publishdrive',
    name: 'PublishDrive',
    description: 'Distribute to 400+ stores and 240,000+ libraries',
    features: ['AI marketing', 'Analytics', 'Wide reach', 'Audiobook support'],
    url: 'https://publishdrive.com',
    logo: '🚀'
  },
  {
    id: 'streetlib',
    name: 'StreetLib',
    description: 'European-based distribution to major platforms',
    features: ['Print & digital', 'Audiobooks', 'Free tools', 'EU focused'],
    url: 'https://streetlib.com',
    logo: '📖'
  },
  {
    id: 'self',
    name: 'Self-Publish Directly',
    description: 'Upload directly to each platform yourself',
    features: ['Full control', 'Higher royalties', 'More work', 'Platform-specific'],
    url: null,
    logo: '✍️'
  }
];

const podServices = [
  {
    id: 'lulu',
    name: 'Lulu',
    description: 'Premium quality print-on-demand',
    url: 'https://lulu.com',
    features: ['Hardcover & paperback', 'Photo books', 'Global shipping']
  },
  {
    id: 'blurb',
    name: 'Blurb',
    description: 'Beautiful photo books and trade books',
    url: 'https://blurb.com',
    features: ['Premium paper', 'Lay-flat binding', 'Amazon distribution']
  },
  {
    id: 'bookbaby',
    name: 'BookBaby',
    description: 'Full-service self-publishing',
    url: 'https://bookbaby.com',
    features: ['Editing services', 'Cover design', 'Marketing help']
  },
  {
    id: 'kdp',
    name: 'Amazon KDP Print',
    description: 'Print books through Amazon',
    url: 'https://kdp.amazon.com',
    features: ['Amazon reach', 'No upfront cost', 'Expanded distribution']
  }
];

const directPlatforms = [
  { id: 'amazon', name: 'Amazon KDP', url: 'https://kdp.amazon.com', icon: '📦' },
  { id: 'bn', name: 'Barnes & Noble Press', url: 'https://press.barnesandnoble.com', icon: '📕' },
  { id: 'apple', name: 'Apple Books', url: 'https://authors.apple.com', icon: '🍎' },
  { id: 'kobo', name: 'Kobo Writing Life', url: 'https://kobowritinglife.com', icon: '📱' },
  { id: 'google', name: 'Google Play Books', url: 'https://play.google.com/books/publish', icon: '📗' },
  { id: 'smashwords', name: 'Smashwords', url: 'https://smashwords.com', icon: '📘' }
];

export const PublishingOptions = ({ 
  bookTitle, 
  onExportPDF, 
  onExportEPUB,
  onExportPrintReady,
  isExporting 
}: PublishingOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<string | null>(null);
  const [selectedPOD, setSelectedPOD] = useState<string | null>(null);
  const [marketplaceLinks, setMarketplaceLinks] = useState<MarketplaceLink[]>([]);
  const [newLinkPlatform, setNewLinkPlatform] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [ebookPrice, setEbookPrice] = useState("9.99");
  const [printPrice, setPrintPrice] = useState("14.99");
  const [useFreeISBN, setUseFreeISBN] = useState(true);
  const { toast } = useToast();

  const handleAddMarketplaceLink = () => {
    if (!newLinkPlatform.trim() || !newLinkUrl.trim()) {
      toast({
        title: "Fill in both fields",
        description: "Please enter both the platform name and URL.",
        variant: "destructive"
      });
      return;
    }
    
    setMarketplaceLinks(prev => [...prev, {
      platform: newLinkPlatform.trim(),
      url: newLinkUrl.trim(),
      status: 'active'
    }]);
    setNewLinkPlatform("");
    setNewLinkUrl("");
    toast({
      title: "Link added!",
      description: `${newLinkPlatform} link has been saved.`
    });
  };

  const handleRemoveLink = (index: number) => {
    setMarketplaceLinks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <Globe className="h-5 w-5" />
          Publish Your Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-6 w-6 text-primary" />
            Publishing Options for "{bookTitle}"
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="export" className="mt-4">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="export" className="gap-1">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </TabsTrigger>
            <TabsTrigger value="distribute" className="gap-1">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Distribute</span>
            </TabsTrigger>
            <TabsTrigger value="print" className="gap-1">
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </TabsTrigger>
            <TabsTrigger value="links" className="gap-1">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Listings</span>
            </TabsTrigger>
          </TabsList>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer" onClick={onExportPDF}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Download PDF</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Standard format for reading and printing at home
                    </p>
                    <Button variant="outline" size="sm" disabled={isExporting}>
                      {isExporting ? "Generating..." : "Download PDF"}
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer" onClick={onExportEPUB}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Download EPUB</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      E-reader format for Kindle, Nook, Apple Books
                    </p>
                    <Button variant="outline" size="sm" disabled={isExporting}>
                      {isExporting ? "Generating..." : "Download EPUB"}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div className="bg-secondary/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Self-Publishing Tips</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Download your files and upload them directly to platforms like Amazon KDP, 
                    Barnes & Noble Press, or Apple Books. Each platform has specific formatting 
                    guidelines - check their help centers for best results.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Distribute Tab */}
          <TabsContent value="distribute" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Choose a distribution service to publish to multiple bookstores with one upload:
            </p>

            <div className="grid gap-3">
              {distributionServices.map((service) => (
                <Card 
                  key={service.id}
                  className={cn(
                    "p-4 cursor-pointer transition-all",
                    selectedDistributor === service.id 
                      ? "border-primary bg-primary/5" 
                      : "hover:border-primary/50"
                  )}
                  onClick={() => setSelectedDistributor(service.id)}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{service.logo}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{service.name}</h3>
                        {selectedDistributor === service.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {service.features.map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {service.url && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(service.url, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {selectedDistributor === 'self' && (
              <div className="border-t border-border pt-4 mt-4">
                <h4 className="font-medium mb-3">Direct Upload Platforms</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {directPlatforms.map((platform) => (
                    <Button
                      key={platform.id}
                      variant="outline"
                      className="justify-start gap-2"
                      onClick={() => window.open(platform.url, '_blank')}
                    >
                      <span>{platform.icon}</span>
                      <span className="text-sm">{platform.name}</span>
                      <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Section */}
            <div className="border-t border-border pt-4 mt-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing Recommendations
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>E-book Price (USD)</Label>
                  <Input 
                    type="number" 
                    value={ebookPrice} 
                    onChange={(e) => setEbookPrice(e.target.value)}
                    placeholder="9.99"
                  />
                  <p className="text-xs text-muted-foreground">
                    Most memoirs sell between $4.99-$14.99
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Print Price (USD)</Label>
                  <Input 
                    type="number" 
                    value={printPrice} 
                    onChange={(e) => setPrintPrice(e.target.value)}
                    placeholder="14.99"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paperbacks typically $12.99-$19.99
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Switch 
                  id="free-isbn" 
                  checked={useFreeISBN} 
                  onCheckedChange={setUseFreeISBN}
                />
                <Label htmlFor="free-isbn">Use free ISBN from distributor</Label>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-10">
                Most distributors provide free ISBNs. Your own ISBN costs $125+ but gives more control.
              </p>
            </div>
          </TabsContent>

          {/* Print-on-Demand Tab */}
          <TabsContent value="print" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Print physical copies without inventory. Books are printed when ordered:
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              {podServices.map((service) => (
                <Card 
                  key={service.id}
                  className={cn(
                    "p-4 cursor-pointer transition-all",
                    selectedPOD === service.id 
                      ? "border-primary bg-primary/5" 
                      : "hover:border-primary/50"
                  )}
                  onClick={() => setSelectedPOD(service.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {service.name}
                        {selectedPOD === service.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(service.url, '_blank');
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {service.features.map((feature, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-secondary/30 rounded-xl p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print-Ready PDF
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Generate a professional print-ready PDF with proper bleed (3mm), trim marks, 
                registration marks, and a full cover spread (front + spine + back) calculated 
                based on your page count.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="text-xs">6" × 9" trim size</Badge>
                <Badge variant="outline" className="text-xs">3mm bleed</Badge>
                <Badge variant="outline" className="text-xs">Auto spine width</Badge>
                <Badge variant="outline" className="text-xs">Crop marks</Badge>
              </div>
              <Button variant="default" size="sm" onClick={onExportPrintReady} disabled={isExporting}>
                <Printer className="h-4 w-4 mr-2" />
                {isExporting ? "Generating..." : "Generate Print-Ready PDF"}
              </Button>
            </div>
          </TabsContent>

          {/* Marketplace Links Tab */}
          <TabsContent value="links" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Track where your book is listed. Add links so readers can find your book:
            </p>

            {/* Existing Links */}
            {marketplaceLinks.length > 0 && (
              <div className="space-y-2">
                {marketplaceLinks.map((link, index) => (
                  <Card key={index} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={link.status === 'active' ? 'default' : 'secondary'}>
                        {link.status}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{link.platform}</p>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          {link.url}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(link.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveLink(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Add New Link */}
            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Marketplace Link
              </h4>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Platform Name</Label>
                  <Input 
                    placeholder="e.g., Amazon, Barnes & Noble"
                    value={newLinkPlatform}
                    onChange={(e) => setNewLinkPlatform(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Book URL</Label>
                  <Input 
                    placeholder="https://amazon.com/dp/..."
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddMarketplaceLink}
                className="mt-3"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Link
              </Button>
            </Card>

            {/* Unpublish Option */}
            <div className="border-t border-border pt-4">
              <h4 className="font-medium mb-2 text-destructive">Unpublish / Take Down</h4>
              <p className="text-sm text-muted-foreground mb-3">
                To remove your book from marketplaces, you'll need to unpublish through 
                each platform or your distribution service. This typically takes 24-72 hours.
              </p>
              <Button variant="outline" size="sm" className="text-destructive border-destructive/30">
                View Unpublishing Guide
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
