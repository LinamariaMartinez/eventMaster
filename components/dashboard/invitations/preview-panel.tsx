"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvitationRenderer } from "@/components/invitation-renderer";
import type { InvitationConfig } from "@/types/invitation-blocks";
import type { EventFormData } from "@/types";
import type { Json } from "@/types/database.types";

interface PreviewPanelProps {
  eventData: EventFormData;
  invitationConfig: InvitationConfig;
  blockContent: Record<string, unknown>;
}

export function PreviewPanel({ eventData, invitationConfig, blockContent }: PreviewPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vista Previa</CardTitle>
        <CardDescription>
          Los cambios se reflejan en tiempo real
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mobile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="mobile">📱 Mobile</TabsTrigger>
            <TabsTrigger value="desktop">💻 Desktop</TabsTrigger>
          </TabsList>

          <TabsContent value="mobile">
            <div className="border rounded-lg overflow-hidden max-h-[600px] overflow-y-auto mx-auto" style={{ maxWidth: '375px' }}>
              <InvitationRenderer
                event={{
                  id: 'preview',
                  user_id: 'preview',
                  title: eventData.title,
                  description: eventData.description || null,
                  date: eventData.date,
                  time: eventData.time,
                  location: eventData.location,
                  template_id: eventData.template_id || null,
                  settings: invitationConfig as unknown as Json,
                  public_url: '/invite/preview',
                  sheets_url: null,
                  whatsapp_number: eventData.whatsapp_number || null,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }}
                config={invitationConfig}
                blockData={blockContent}
              />
            </div>
          </TabsContent>

          <TabsContent value="desktop">
            <div className="border rounded-lg overflow-hidden max-h-[600px] overflow-y-auto">
              <InvitationRenderer
                event={{
                  id: 'preview',
                  user_id: 'preview',
                  title: eventData.title,
                  description: eventData.description || null,
                  date: eventData.date,
                  time: eventData.time,
                  location: eventData.location,
                  template_id: eventData.template_id || null,
                  settings: invitationConfig as unknown as Json,
                  public_url: '/invite/preview',
                  sheets_url: null,
                  whatsapp_number: eventData.whatsapp_number || null,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }}
                config={invitationConfig}
                blockData={blockContent}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
