import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image as ImageIcon, Save } from "lucide-react";

interface Settings {
  id: string;
  logoUrl: string | null;
  bannerImageUrl: string | null;
}

export function AppSettings() {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const { data: settings } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Settings>) => {
      const res = await apiRequest('PATCH', '/api/settings', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (file: File, type: 'logo' | 'banner') => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (type === 'logo') {
          setLogoPreview(dataUrl);
        } else {
          setBannerPreview(dataUrl);
        }
        resolve(dataUrl);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Logo must be less than 2MB",
          variant: "destructive",
        });
        return;
      }
      await handleFileUpload(file, 'logo');
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Banner must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      await handleFileUpload(file, 'banner');
    }
  };

  const handleSave = () => {
    updateMutation.mutate({
      logoUrl: logoPreview || settings?.logoUrl || null,
      bannerImageUrl: bannerPreview || settings?.bannerImageUrl || null,
    });
  };

  const currentLogo = logoPreview || settings?.logoUrl;
  const currentBanner = bannerPreview || settings?.bannerImageUrl;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logo Upload</CardTitle>
          <CardDescription>Upload your organization logo (PNG, JPG, or SVG - max 2MB)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo-upload">Logo Image</Label>
            <div className="flex items-center gap-4">
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                data-testid="input-logo-upload"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => document.getElementById('logo-upload')?.click()}
                data-testid="button-logo-browse"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {currentLogo && (
            <div className="border rounded-lg p-4 bg-muted/20">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <img
                src={currentLogo}
                alt="Logo preview"
                className="max-h-24 object-contain"
                data-testid="img-logo-preview"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banner Image Upload</CardTitle>
          <CardDescription>Upload a banner image for the landing page (recommended 1920x400px - max 5MB)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="banner-upload">Banner Image</Label>
            <div className="flex items-center gap-4">
              <Input
                id="banner-upload"
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                data-testid="input-banner-upload"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => document.getElementById('banner-upload')?.click()}
                data-testid="button-banner-browse"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {currentBanner && (
            <div className="border rounded-lg p-4 bg-muted/20">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <img
                src={currentBanner}
                alt="Banner preview"
                className="max-h-32 w-full object-cover rounded"
                data-testid="img-banner-preview"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending || (!logoPreview && !bannerPreview)}
          data-testid="button-save-settings"
        >
          <Save className="h-4 w-4 mr-2" />
          {updateMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
