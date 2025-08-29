"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles } from "lucide-react";
import { InvitationType } from "@/lib/storage";

interface InvitationTypeSelectorProps {
  selectedType: "simple" | "premium" | null;
  onTypeSelect: (type: "simple" | "premium") => void;
  invitationTypes: InvitationType[];
}

export function InvitationTypeSelector({
  selectedType,
  onTypeSelect,
  invitationTypes,
}: InvitationTypeSelectorProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {invitationTypes.map((type) => (
        <Card
          key={type.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedType === type.id
              ? "ring-2 ring-primary shadow-lg"
              : "hover:shadow-md"
          }`}
          onClick={() => onTypeSelect(type.id)}
        >
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              {type.id === "premium" ? (
                <Crown className="h-8 w-8 text-yellow-500 mr-2" />
              ) : (
                <Sparkles className="h-8 w-8 text-blue-500 mr-2" />
              )}
              <CardTitle className="text-2xl">{type.name}</CardTitle>
              {selectedType === type.id && (
                <Check className="h-6 w-6 text-green-500 ml-2" />
              )}
            </div>
            <CardDescription className="text-lg">
              {type.description}
            </CardDescription>
            <Badge 
              variant={type.id === "premium" ? "default" : "secondary"}
              className="text-lg py-1 px-3"
            >
              {type.price}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Características incluidas:</h4>
              <ul className="space-y-2">
                {type.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button 
              className="w-full"
              variant={selectedType === type.id ? "default" : "outline"}
            >
              {selectedType === type.id ? "Seleccionado" : `Seleccionar ${type.name}`}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}