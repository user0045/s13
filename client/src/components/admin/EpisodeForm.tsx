
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface Episode {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

interface EpisodeFormProps {
  episode: Episode;
  onUpdate: (updates: Partial<Episode>) => void;
  onDelete?: () => void;
}

const EpisodeForm = ({ episode, onUpdate, onDelete }: EpisodeFormProps) => {
  return (
    <Card className="bg-gradient-to-br from-black/90 via-dark-green/20 to-black/90 backdrop-blur-sm border border-border/50">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm text-foreground">{episode.title}</CardTitle>
        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-foreground">Episode Title</Label>
            <Input
              value={episode.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="bg-background/50 border-border/50 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Duration (minutes)</Label>
            <Input
              type="number"
              value={episode.duration}
              onChange={(e) => onUpdate({ duration: e.target.value })}
              className="bg-background/50 border-border/50 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Video URL</Label>
            <Input
              type="url"
              value={episode.videoUrl}
              onChange={(e) => onUpdate({ videoUrl: e.target.value })}
              className="bg-background/50 border-border/50 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Thumbnail URL</Label>
            <Input
              type="url"
              value={episode.thumbnailUrl}
              onChange={(e) => onUpdate({ thumbnailUrl: e.target.value })}
              className="bg-background/50 border-border/50 focus:border-primary"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Episode Description</Label>
          <Textarea
            value={episode.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="bg-background/50 border-border/50 focus:border-primary"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EpisodeForm;
