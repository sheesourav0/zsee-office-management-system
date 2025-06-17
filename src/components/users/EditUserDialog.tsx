import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/chakra/Dialog";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/chakra/Form";
import { Input } from "@/components/chakra/Input";
import { Button } from "@/components/chakra/Button";
import { Select } from "@/components/chakra/Select";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@/components/chakra/Tabs";
import { Checkbox } from "@/components/chakra/Checkbox";
import { toast } from "@/hooks/use-toast";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  roles: any[];
  policies: any[];
  onUpdateUser: (data: any) => void;
}

const userEditSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  roleId: z.string().min(1, {
    message: "Please select a role.",
  }),
  policyIds: z.string().array().optional(),
  isAccountActive: z.boolean().default(true),
  isEmailVerified: z.boolean().default(false),
});

const EditUserDialog = ({
  open,
  onOpenChange,
  user,
  roles,
  policies,
  onUpdateUser,
}: EditUserDialogProps) => {
  const [isPoliciesAssigned, setIsPoliciesAssigned] = useState(false);

  const form = useForm<z.infer<typeof userEditSchema>>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      roleId: user?.roleId || "",
      policyIds: user?.policyIds || [],
      isAccountActive: user?.isAccountActive || true,
      isEmailVerified: user?.isEmailVerified || false,
    },
  });

  useEffect(() => {
    form.reset({
      name: user?.name || "",
      email: user?.email || "",
      roleId: user?.roleId || "",
      policyIds: user?.policyIds || [],
      isAccountActive: user?.isAccountActive || true,
      isEmailVerified: user?.isEmailVerified || false,
    });
  }, [user, form]);

  const onSubmit = (values: z.infer<typeof userEditSchema>) => {
    onUpdateUser({ ...values, id: user.id });
    toast.success("User updated successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="account">
          <TabList>
            <Tab value="account">Account</Tab>
            <Tab value="roles">Roles & Policies</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="account">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="User name" {...field} />
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
                          <Input placeholder="user@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isAccountActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Account Status</FormLabel>
                        </div>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isEmailVerified"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Email Verified</FormLabel>
                        </div>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Account</Button>
                </div>
              </form>
            </TabPanel>
            <TabPanel value="roles">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <Select.Trigger />
                        </FormControl>
                        <Select.Content>
                          {roles.map((role: any) => (
                            <Select.Item key={role.id} value={role.id}>
                              {role.name}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="policyIds"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Policies</FormLabel>
                        <Button type="button" variant="link" size="sm" onClick={() => setIsPoliciesAssigned(!isPoliciesAssigned)}>
                          {isPoliciesAssigned ? "Unassign All" : "Assign All"}
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-[300px] overflow-y-auto">
                        {policies.map((policy: any) => (
                          <FormItem key={policy.id} className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(policy.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), policy.id]);
                                  } else {
                                    field.onChange(field.value?.filter((id: any) => id !== policy.id));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">{policy.name}</FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Roles & Policies</Button>
                </div>
              </form>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
