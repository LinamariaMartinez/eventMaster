"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shirt, 
  Gift, 
  ExternalLink, 
  Info, 
  Heart,
  Sparkles,
  ShoppingBag
} from "lucide-react";

interface DressCodeSectionProps {
  dressCode?: string;
  className?: string;
}

interface GiftSectionProps {
  giftInfo?: string;
  giftRegistryUrl?: string;
  className?: string;
}

interface AdditionalInfoSectionProps {
  additionalInfo?: string;
  className?: string;
}

// Dress code suggestions based on common dress codes
const getDressCodeDetails = (dressCode: string) => {
  const code = dressCode.toLowerCase();
  
  if (code.includes('formal') || code.includes('etiqueta')) {
    return {
      icon: <Sparkles className="h-4 w-4" />,
      color: 'default' as const,
      suggestions: [
        'Traje oscuro o vestido largo',
        'Corbata o pajarita requerida',
        'Zapatos de vestir',
        'Evitar colores muy llamativos'
      ]
    };
  }
  
  if (code.includes('casual') || code.includes('informal')) {
    return {
      icon: <Shirt className="h-4 w-4" />,
      color: 'secondary' as const,
      suggestions: [
        'Ropa cómoda pero elegante',
        'Pantalón de vestir o falda',
        'Camisa o blusa',
        'Zapatos cómodos'
      ]
    };
  }
  
  if (code.includes('cocktail') || code.includes('cóctel')) {
    return {
      icon: <Heart className="h-4 w-4" />,
      color: 'default' as const,
      suggestions: [
        'Vestido midi o traje semi-formal',
        'Accesorios elegantes',
        'Tacones medianos o zapatos de vestir',
        'Maquillaje y peinado arreglado'
      ]
    };
  }
  
  if (code.includes('playa') || code.includes('beach')) {
    return {
      icon: <Shirt className="h-4 w-4" />,
      color: 'secondary' as const,
      suggestions: [
        'Ropa ligera y fresca',
        'Colores claros',
        'Sandalias o zapatos abiertos',
        'Protector solar y sombrero'
      ]
    };
  }
  
  return {
    icon: <Shirt className="h-4 w-4" />,
    color: 'outline' as const,
    suggestions: []
  };
};

export function DressCodeSection({ dressCode, className = "" }: DressCodeSectionProps) {
  if (!dressCode) return null;

  const details = getDressCodeDetails(dressCode);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {details.icon}
          Código de Vestimenta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Badge variant={details.color} className="text-lg py-2 px-4 mb-3">
            {dressCode}
          </Badge>
        </div>

        {details.suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Sugerencias:</h4>
            <ul className="space-y-2">
              {details.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Si tienes dudas sobre el código de vestimenta, no dudes en contactar a los anfitriones.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function GiftSection({ giftInfo, giftRegistryUrl, className = "" }: GiftSectionProps) {
  if (!giftInfo && !giftRegistryUrl) return null;

  const openRegistry = () => {
    if (giftRegistryUrl) {
      window.open(giftRegistryUrl, '_blank');
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Información sobre Regalos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {giftInfo && (
          <div className="space-y-2">
            <p className="text-sm leading-relaxed">{giftInfo}</p>
          </div>
        )}

        {giftRegistryUrl && (
          <div className="space-y-3">
            <Button 
              onClick={openRegistry}
              className="w-full"
              variant="default"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Ver Lista de Regalos
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {!giftRegistryUrl && giftInfo && (
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Heart className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-800">
                Tu presencia es el mejor regalo, pero si deseas obsequiar algo especial, cualquier detalle será muy apreciado.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AdditionalInfoSection({ additionalInfo, className = "" }: AdditionalInfoSectionProps) {
  if (!additionalInfo) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Información Adicional
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {additionalInfo}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Combined component that renders all sections
interface EventDetailsSectionsProps {
  dressCode?: string;
  giftInfo?: string;
  giftRegistryUrl?: string;
  additionalInfo?: string;
  className?: string;
}

export function EventDetailsSections({
  dressCode,
  giftInfo,
  giftRegistryUrl,
  additionalInfo,
  className = ""
}: EventDetailsSectionsProps) {
  const hasAnyContent = dressCode || giftInfo || giftRegistryUrl || additionalInfo;
  
  if (!hasAnyContent) return null;

  return (
    <div className={`space-y-6 ${className}`}>
      <DressCodeSection dressCode={dressCode} />
      <GiftSection giftInfo={giftInfo} giftRegistryUrl={giftRegistryUrl} />
      <AdditionalInfoSection additionalInfo={additionalInfo} />
    </div>
  );
}