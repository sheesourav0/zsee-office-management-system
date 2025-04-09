
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { getPermissionsForRole, permissions, UserRole, roles } from "@/lib/roles";
import { User } from "./UsersList";

// Schema for form validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.enum(["admin", "manager", "viewer", "superadmin"]),
  phone: z.string().optional(),
  customPermissions: z.record(z.boolean()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (user: User) => void;
}

const EditUserDialog = ({ user, open, onOpenChange, onUpdate }: EditUserDialogProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const [isUsingCustomPermissions, setIsUsingCustomPermissions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with user data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      customPermissions: user.customPermissions || Object.fromEntries(
        Object.keys(permissions).map(key => [key, false])
      ),
    },
  });

  // Set the initial state of custom permissions checkbox
  const watchRole = form.watch("role");
  const watchCustomPermissions = form.watch("customPermissions");

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Update the user
      const updatedUser: User = {
        ...user,
        name: values.name,
        email: values.email,
        role: values.role,
        phone: values.phone,
        customPermissions: isUsingCustomPermissions ? values.customPermissions : undefined,
      };

      onUpdate(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle role change
  const handleRoleChange = (role: UserRole) => {
    form.setValue("role", role);
    // Reset custom permissions when role changes
    if (isUsingCustomPermissions) {
      const rolePermissions = roles[role].permissions;
      const updatedPermissions = Object.fromEntries(
        Object.keys(permissions).map(key => [key, rolePermissions.includes(key)])
      );
      form.setValue("customPermissions", updatedPermissions);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">User Details</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              <TabsContent value="details" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={(value: UserRole) => handleRoleChange(value)}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="superadmin">Super Admin</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4">
                <div className="flex items-center space-x-2 pb-4">
                  <Checkbox
                    id="custom-permissions"
                    checked={isUsingCustomPermissions}
                    onCheckedChange={(checked) => {
                      setIsUsingCustomPermissions(checked as boolean);
                    }}
                  />
                  <label
                    htmlFor="custom-permissions"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Use custom permissions instead of role-based permissions
                  </label>
                </div>

                {isUsingCustomPermissions ? (
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-4">Custom Permissions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(permissions).map(([key, permission]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <FormField
                              control={form.control}
                              name={`customPermissions.${key}`}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-normal">
                                      {permission.name}
                                    </FormLabel>
                                    <p className="text-xs text-muted-foreground">
                                      {permission.description}
                                    </p>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-4">Role-based Permissions ({roles[watchRole].name})</h3>
                    <p className="text-sm text-muted-foreground mb-4">{roles[watchRole].description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getPermissionsForRole(watchRole).map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox checked disabled />
                          <div>
                            <label className="text-sm font-medium">{permission.name}</label>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
