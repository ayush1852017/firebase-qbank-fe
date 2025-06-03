"use client";

import { useUserMode } from '@/contexts/user-mode-context';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Users, Briefcase } from 'lucide-react';

export function UserModeToggle() {
  const { mode, toggleMode } = useUserMode();

  return (
    <div className="flex items-center space-x-2 p-2 rounded-lg bg-primary/10">
      <Label htmlFor="user-mode-toggle" className="flex items-center text-sm font-medium text-primary">
        <Users className={`mr-2 h-5 w-5 ${mode === 'student' ? 'text-accent' : 'text-muted-foreground'}`} />
        Student
      </Label>
      <Switch
        id="user-mode-toggle"
        checked={mode === 'creator'}
        onCheckedChange={toggleMode}
        className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-primary"
      />
      <Label htmlFor="user-mode-toggle" className="flex items-center text-sm font-medium text-primary">
        <Briefcase className={`mr-2 h-5 w-5 ${mode === 'creator' ? 'text-accent' : 'text-muted-foreground'}`} />
        Creator
      </Label>
    </div>
  );
}
