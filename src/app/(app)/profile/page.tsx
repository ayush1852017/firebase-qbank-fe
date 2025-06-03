"use client";

import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, Edit, Save, Mail, User as UserIconLucide } from 'lucide-react'; // Renamed User to avoid conflict
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';


export default function ProfilePage() {
  const { user, login } = useAuth(); // Using login to update user, effectively
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || ''); // Email typically not editable

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);
  
  const getInitials = (nameStr?: string) => {
    if (!nameStr) return 'U';
    const names = nameStr.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  const handleSave = () => {
    if (user) {
      // Simulate updating user
      login(user.email, name); // This will update the user in AuthContext and localStorage
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
        variant: "default",
      });
    }
    setIsEditing(false);
  };


  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 p-8">
          <div className="flex flex-col md:flex-row items-center md:space-x-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={`https://placehold.co/128x128.png?text=${getInitials(user.name)}`} alt={user.name || 'User'} data-ai-hint="profile avatar large" />
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4 md:mt-0 text-center md:text-left">
              <CardTitle className="text-3xl md:text-4xl font-headline text-primary">{user.name || 'User Name'}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground flex items-center justify-center md:justify-start">
                <Mail className="h-4 w-4 mr-2" /> {user.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Profile Information</h2>
            <Button variant={isEditing ? "default" : "outline"} onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="transition-all">
              {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-muted-foreground flex items-center">
                <UserIconLucide className="h-4 w-4 mr-2" /> Full Name
              </Label>
              {isEditing ? (
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="mt-1 text-lg p-2 border-input focus:border-primary"
                  placeholder="Your full name"
                />
              ) : (
                <p className="text-lg text-foreground mt-1 p-2 border border-transparent">{user.name || 'Not set'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-muted-foreground flex items-center">
                <Mail className="h-4 w-4 mr-2" /> Email Address
              </Label>
              <Input 
                id="email" 
                value={email} 
                readOnly 
                className="mt-1 text-lg p-2 bg-muted/50 border-muted/50 cursor-not-allowed"
              />
               <p className="text-xs text-muted-foreground mt-1">Email address cannot be changed.</p>
            </div>
            
            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Account Security</h3>
               <Button variant="outline" className="text-primary border-primary/50 hover:bg-primary/10">
                <ShieldCheck className="mr-2 h-4 w-4" /> Change Password
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Ensure your account is secure with a strong, unique password.
              </p>
            </div>
            
            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Preferences</h3>
              {/* Placeholder for preferences like notification settings */}
              <p className="text-muted-foreground">Notification and app preferences will be managed here.</p>
              <div className="mt-4 flex items-center space-x-4">
                <img src="https://placehold.co/300x150.png" data-ai-hint="settings toggles" alt="Preferences placeholder" className="rounded-md shadow-sm"/>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
