
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Check, Shield, Globe, Clock, Users } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(5, {
    message: "Please enter a valid phone number.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

const RegisterForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      terms: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Submit form data to backend
  }

  const benefits = [
    {
      icon: Globe,
      text: "Access to 10,000+ trading instruments"
    },
    {
      icon: Clock,
      text: "Ultra-fast execution with no requotes"
    },
    {
      icon: Users,
      text: "Free demo account with $10,000 virtual funds"
    },
    {
      icon: Shield,
      text: "24/5 customer support in multiple languages"
    }
  ];

  return (
    <div className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute -left-40 bottom-0 w-80 h-80 bg-quantis-purple/5 rounded-full blur-3xl"></div>
      <div className="absolute -right-40 top-0 w-80 h-80 bg-quantis-blue/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="inline-block py-1.5 px-3 rounded-full bg-quantis-purple/10 text-quantis-purple font-medium text-sm mb-6">
              Get Started
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
              Open Your <span className="text-quantis-purple">Trading Account</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Get started in minutes and join thousands of traders worldwide.
            </p>
            
            <div className="mt-10 space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-quantis-purple/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-5 w-5 text-quantis-purple" />
                  </div>
                  <p className="ml-4 text-gray-700 font-medium">{benefit.text}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-100 shadow-md">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-quantis-green/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <Check className="h-5 w-5 text-quantis-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Regulated and Secure</h3>
                  <p className="text-gray-600 mt-1">
                    Quantis is a regulated broker that adheres to strict financial standards and protects client funds with segregated accounts.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 font-display">Create Account</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="h-12" {...field} />
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
                      <FormLabel className="font-medium">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" type="email" className="h-12" {...field} />
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
                      <FormLabel className="font-medium">Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 890" type="tel" className="h-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Password</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" type="password" className="h-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                          className="data-[state=checked]:bg-quantis-purple data-[state=checked]:border-quantis-purple"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal text-sm text-gray-700">
                          I agree to the <a href="#" className="text-quantis-purple font-medium hover:underline">terms and conditions</a> and <a href="#" className="text-quantis-purple font-medium hover:underline">privacy policy</a>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-quantis-purple hover:bg-quantis-secondary text-white h-12 text-base rounded-xl"
                >
                  Create Account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
            
            <div className="mt-8 text-center text-sm text-gray-500">
              Already have an account? <a href="#" className="font-medium text-quantis-purple hover:underline">Log in</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
