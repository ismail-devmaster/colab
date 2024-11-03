"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Badge } from "@/app/components/ui/badge"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Switch } from "@/app/components/ui/switch"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Progress } from "@/app/components/ui/progress"
import { Textarea } from "@/app/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import { Calendar as CalendarIcon,  Sun, Moon, Users, MessageSquare, BarChart, FileText,  Settings, Plus, Search, Edit, Trash2, CheckCircle,   Package, DollarSign, Clipboard, Menu, LogOut, User, Stethoscope } from "lucide-react"
import { format } from "date-fns"

// Mock data (expanded)
const mockPatients = [
  { id: 1, name: "John Doe", age: 35, lastVisit: "2023-05-15", nextAppointment: "2023-11-20", medicalHistory: "Allergic to penicillin", ongoingTreatments: "Root Canal", status: "In Progress", priority: "Medium", allergies: ["Penicillin"], procedures: ["Cleaning", "X-Ray"], notes: "Patient experiences dental anxiety", image: "/placeholder-avatar.jpg" },
  { id: 2, name: "Jane Smith", age: 28, lastVisit: "2023-06-22", nextAppointment: "2023-12-05", medicalHistory: "None", ongoingTreatments: "Teeth Whitening", status: "Scheduled", priority: "Low", allergies: [], procedures: ["Whitening"], notes: "Interested in cosmetic dentistry", image: "/placeholder-avatar.jpg" },
  { id: 3, name: "Mike Johnson", age: 42, lastVisit: "2023-07-10", nextAppointment: "2023-11-25", medicalHistory: "Diabetes", ongoingTreatments: "Dental Implants", status: "Completed", priority: "High", allergies: ["Latex"], procedures: ["Implant", "Crown"], notes: "Requires frequent follow-ups due to diabetes", image: "/placeholder-avatar.jpg" },
  { id: 4, name: "Emily Brown", age: 31, lastVisit: "2023-08-05", nextAppointment: "2023-12-10", medicalHistory: "Pregnancy - 2nd trimester", ongoingTreatments: "Regular Checkup", status: "Scheduled", priority: "Medium", allergies: [], procedures: ["Cleaning"], notes: "Extra care needed due to pregnancy", image: "/placeholder-avatar.jpg" },
  { id: 5, name: "David Wilson", age: 55, lastVisit: "2023-09-18", nextAppointment: "2023-11-30", medicalHistory: "High blood pressure", ongoingTreatments: "Dentures Fitting", status: "In Progress", priority: "Medium", allergies: ["Codeine"], procedures: ["Dentures"], notes: "Monitor blood pressure before procedures", image: "/placeholder-avatar.jpg" },
]

const mockAppointments = [
  { id: 1, patientId: 1, date: "2023-11-20", time: "09:00", type: "Root Canal", status: "Scheduled", notes: "Patient requested early morning appointment" },
  { id: 2, patientId: 2, date: "2023-12-05", time: "10:30", type: "Teeth Whitening", status: "Confirmed", notes: "Follow-up appointment after initial consultation" },
  { id: 3, patientId: 3, date: "2023-11-25", time: "14:00", type: "Implant Checkup", status: "Scheduled", notes: "Post-operative checkup" },
  { id: 4, patientId: 4, date: "2023-12-10", time: "11:00", type: "Regular Checkup", status: "Confirmed", notes: "Routine pregnancy dental check" },
  { id: 5, patientId: 5, date: "2023-11-30", time: "15:30", type: "Dentures Fitting", status: "Scheduled", notes: "Final fitting session" },
]

const mockInventory = [
  { id: 1, name: "Dental Floss", quantity: 45, status: "Good", lastRestocked: "2023-10-15", supplier: "DentalSupplies Inc." },
  { id: 2, name: "Latex Gloves", quantity: 12, status: "Low", lastRestocked: "2023-09-30", supplier: "MedEquip Co." },
  { id: 3, name: "Face Masks", quantity: 30, status: "Good", lastRestocked: "2023-10-05", supplier: "SafetyFirst Ltd." },
  { id: 4, name: "Dental Mirrors", quantity: 20, status: "Good", lastRestocked: "2023-08-20", supplier: "DentalTools Corp." },
  { id: 5, name: "Anesthetic", quantity: 5, status: "Low", lastRestocked: "2023-09-10", supplier: "MedPharm Inc." },
]

const mockBillingRecords = [
  { id: 1, patientId: 1, treatment: "Root Canal", amount: 800, status: "Paid", date: "2023-11-05", paymentMethod: "Credit Card" },
  { id: 2, patientId: 2, treatment: "Teeth Whitening", amount: 250, status: "Pending", date: "2023-11-10", paymentMethod: "Pending" },
  { id: 3, patientId: 3, treatment: "Dental Implant", amount: 3000, status: "Partial", date: "2023-10-25", paymentMethod: "Cash" },
  { id: 4, patientId: 4, treatment: "Regular Checkup", amount: 150, status: "Paid", date: "2023-11-15", paymentMethod: "Insurance" },
  { id: 5, patientId: 5, treatment: "Dentures", amount: 1200, status: "Pending", date: "2023-11-20", paymentMethod: "Pending" },
]


const mockMessages = [
    { id: 1, from: 'John Doe', to: 'Dr. Smith', content: 'Can we reschedule my appointment?', timestamp: '2023-11-19T09:00:00', read: false },
    { id: 2, from: 'Dr. Smith', to: 'Jane Smith', content: 'Your test results are ready.', timestamp: '2023-11-18T14:30:00', read: true },
    { id: 3, from: 'Mike Johnson', to: 'Dr. Smith', content: 'Thank you for the great service!', timestamp: '2023-11-17T11:15:00', read: true },
    { id: 4, from: 'Dr. Smith', to: 'Emily Brown', content: 'Don\'t forget your appointment tomorrow.', timestamp: '2023-11-19T16:45:00', read: false }, // Fixed quotation
    { id: 5, from: 'David Wilson', to: 'Dr. Smith', content: 'I have a question about my medication.', timestamp: '2023-11-18T10:20:00', read: false },
  ];
  

export default function InteractiveDashboardComponent() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("'appointments'")
  const [patients, setPatients] = useState(mockPatients)
  const [appointments, setAppointments] = useState(mockAppointments)
  const [inventory, setInventory] = useState(mockInventory)
  const [billingRecords, setBillingRecords] = useState(mockBillingRecords)
  const [todos, setTodos] = useState(mockTodos)
  const [messages, setMessages] = useState(mockMessages)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [searchTerm, setSearchTerm] = useState("''")
  const [isAddPatientDialogOpen, setIsAddPatientDialogOpen] = useState(false)
  const [isAddBillingRecordDialogOpen, setIsAddBillingRecordDialogOpen] = useState(false)
  const [isAddTodoDialogOpen, setIsAddTodoDialogOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [isPatientProfileOpen, setIsPatientProfileOpen] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("'dark'")
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof patient.ongoingTreatments === 'string' && patient.ongoingTreatments.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  

  const addPatient = (newPatient) => {
    setPatients([...patients, { ...newPatient, id: patients.length + 1 }])
    setIsAddPatientDialogOpen(false)
  }

  const updatePatient = (updatedPatient) => {
    setPatients(patients.map(p => p.id === updatedPatient.id ? updatedPatient : p))
  }

  const deletePatient = (patientId) => {
    setPatients(patients.filter(p => p.id !== patientId))
  }

  const addInventoryItem = (newItem) => {
    setInventory([...inventory, { ...newItem, id: inventory.length + 1 }])
    setIsAddInventoryItemDialogOpen(false)
  }

  const updateInventoryItem = (updatedItem) => {
    setInventory(inventory.map(i => i.id === updatedItem.id ? updatedItem : i))
  }

  const deleteInventoryItem = (itemId) => {
    setInventory(inventory.filter(i => i.id !== itemId))
  }

  const addBillingRecord = (newRecord) => {
    setBillingRecords([...billingRecords, { ...newRecord, id: billingRecords.length + 1 }])
    setIsAddBillingRecordDialogOpen(false)
  }

  const updateBillingRecord = (updatedRecord) => {
    setBillingRecords(billingRecords.map(r => r.id === updatedRecord.id ? updatedRecord : r))
  }

  const deleteBillingRecord = (recordId) => {
    setBillingRecords(billingRecords.filter(r => r.id !== recordId))
  }


  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    const items = Array.from(todos)
    const [reorderedItem] = items.splice(result.source.index, 1)
    
    items.splice(result.destination.index, 0, reorderedItem)

    setTodos(items)
  }

  const openPatientProfile = (patient) => {
    setSelectedPatient(patient)
    setIsPatientProfileOpen(true)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "'dark'" : "''"} bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white`}>
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "'spring'", stiffness: 300, damping: 30 }}
        className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60"
      >
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Stethoscope className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            <span className="ml-2 text-xl flex justify-center items-center  text-center font-bold">DentaCare</span>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-4">
              <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
              <Label htmlFor="dark-mode" className="sr-only">Dark mode</Label>
              {isDarkMode ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Dr. Smith" />
                    <AvatarFallback>DS</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Dr. Smith</p>
                    <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                      dr.smith@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "'spring'", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-48 border-r bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60 overflow-y-auto"
            >
              <nav className="flex-1 space-y-2 p-4">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("appointments")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Appointments
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("patients")}>
                  <Users className="mr-2 h-4 w-4" />
                  Patients
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("treatments")}>
                  <Clipboard className="mr-2 h-4 w-4" />
                  Treatments
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("inventory")}>
                  <Package className="mr-2 h-4 w-4" />
                  Inventory
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("billing")}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Billing
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("todos")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Todos
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("messages")}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("analytics")}>
                  <BarChart className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto p-6 ${isSidebarOpen ? "'md:ml-64'" : "''"}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="container mx-auto"
          >
            <h1 className="text-3xl font-bold mb-6">Dental Dashboard</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="treatments">Treatments</TabsTrigger>  
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
             
              </TabsList>

              <TabsContent value="appointments">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointments</CardTitle>
                    <CardDescription>Manage your appointments</CardDescription>
                  </CardHeader>
                  <CardContent>
          
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell>{patients.find(p => p.id === appointment.patientId)?.name}</TableCell>
                            <TableCell>{appointment.date}</TableCell>
                            <TableCell>{appointment.time}</TableCell>
                            <TableCell>{appointment.type}</TableCell>
                            <TableCell>
                              <Badge variant={appointment.status === "Confirmed" ? "default" : "secondary"}>
                                {appointment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => updateAppointment({ ...appointment, status: "'Confirmed'" })}>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => {/* Open edit appointment dialog */}}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteAppointment(appointment.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="patients">
                <Card>
                  <CardHeader>
                    <CardTitle>Patients</CardTitle>
                    <CardDescription>Manage patient records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-4">
                      <div className="flex space-x-2">
                        <Input
                          
                        
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button>
                          <Search className="mr-2 h-4 w-4" />
                          Search
                        </Button>
                      </div>
                      <Button onClick={() => setIsAddPatientDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Patient
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Last Visit</TableHead>
                          <TableHead>Next Appointment</TableHead>
                          <TableHead>Status</TableHead>
                  
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPatients.map((patient) => (
                          <TableRow key={patient.id}>
                            <TableCell>{patient.name}</TableCell>
                            <TableCell>{patient.age}</TableCell>
                            <TableCell>{patient.lastVisit}</TableCell>
                            <TableCell>{patient.nextAppointment}</TableCell>
                            <TableCell>
                              <Badge variant={patient.status === "'Completed'" ? "'success'" : patient.status === "'In Progress'" ? "'warning'" : "'secondary'"}>
                                {patient.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={patient.priority === "'High'" ? "'destructive'" : patient.priority === "'Medium'" ? "'warning'" : "'secondary'"}>
                                {patient.priority}
                              </Badge>
                            </TableCell>
                     
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="treatments">
                <Card>
                  <CardHeader>
                    <CardTitle>Treatments</CardTitle>
                    <CardDescription>Ongoing treatments and procedures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Treatment</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patients.map((patient) => (
                          <TableRow key={patient.id}>
                            <TableCell>{patient.name}</TableCell>
                            <TableCell>{patient.ongoingTreatments}</TableCell>
                            <TableCell>
                              <Progress value={Math.random() * 100} className="w-[60%]" />
                            </TableCell>
                            <TableCell>{patient.lastVisit}</TableCell>
                            <TableCell>{patient.nextAppointment}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              

              <TabsContent value="billing">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing</CardTitle>
                    <CardDescription>Manage patient invoices and payments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-4">
                      <Input placeholder="Search billing records..." className="max-w-sm" />
                      <Button onClick={() => setIsAddBillingRecordDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Record
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Treatment</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {billingRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{patients.find(p => p.id === record.patientId)?.name}</TableCell>
                            <TableCell>{record.treatment}</TableCell>
                            <TableCell>${record.amount}</TableCell>
                            <TableCell>
                              <Badge variant={record.status === "'Paid'" ? "'success'" : record.status === "'Pending'" ? "'warning'" : "'destructive'"}>
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>{record.paymentMethod}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => {/* Open payment dialog */}}>
                                <DollarSign className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => {/* Open edit record dialog */}}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteBillingRecord(record.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages">
                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                    <CardDescription>Communicate with patients and staff</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-4">
                      <Input placeholder="Search messages..." className="max-w-sm" />
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Message
                      </Button>
                    </div>
                    <ScrollArea className="h-[400px]">
                      {messages.map((message) => (
                        <div key={message.id} className="flex items-start space-x-4 mb-4">
                          <Avatar>
                            <AvatarImage src="/placeholder-avatar.jpg" alt={message.from} />
                            <AvatarFallback>{message.from[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{message.from}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{message.content}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(message.timestamp), "'PPpp'")}</p>
                          </div>
                          {!message.read && (
                            <Badge variant="secondary">New</Badge>
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="w-full" variant="outline" onClick={() => setIsAddPatientDialogOpen(true)}>
                  <Users className="mr-2 h-4 w-4" />
                  Add Patient
                </Button>
                <Button className="w-full" variant="outline" onClick={() => setIsAddBillingRecordDialogOpen(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Create Invoice
                </Button>
                <Button className="w-full" variant="outline" onClick={() => setActiveTab("messages")}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t text-center bg-white dark:bg-gray-900">
        <div className="container flex flex-col items-center text-center justify-center  py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-gray-600 dark:text-gray-400 md:text-left">
              © 2023 DentaCare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <Dialog open={isAddPatientDialogOpen} onOpenChange={setIsAddPatientDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>Enter the details of the new patient.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target as HTMLFormElement)
            const newPatient = Object.fromEntries(formData.entries())
            addPatient(newPatient)
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right">Age</Label>
                <Input id="age" name="age" type="number" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastVisit" className="text-right">Last Visit</Label>
                <Input id="lastVisit" name="lastVisit" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nextAppointment" className="text-right">Next Appointment</Label>
                <Input id="nextAppointment" name="nextAppointment" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="medicalHistory" className="text-right">Medical History</Label>
                <Textarea id="medicalHistory" name="medicalHistory" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Patient</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    

      <Dialog open={isAddBillingRecordDialogOpen} onOpenChange={setIsAddBillingRecordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Billing Record</DialogTitle>
            <DialogDescription>Enter the details of the new billing record.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target as HTMLFormElement)
            const newRecord = Object.fromEntries(formData.entries())
            addBillingRecord(newRecord)
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="patientId" className="text-right">Patient</Label>
                <Select name="patientId">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>{patient.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="treatment" className="text-right">Treatment</Label>
                <Input id="treatment" name="treatment" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount</Label>
                <Input id="amount" name="amount" type="number" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input id="date" name="date" type="date" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

     
      <Dialog open={isPatientProfileOpen} onOpenChange={setIsPatientProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Patient Profile</DialogTitle>
            <DialogDescription>Detailed information about the patient.</DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedPatient.image} alt={selectedPatient.name} />
                  <AvatarFallback>{selectedPatient.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedPatient.name}</h3>
                  <p className="text-sm text-gray-500">Age: {selectedPatient.age}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Last Visit</p>
                  <p className="text-sm">{selectedPatient.lastVisit}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Next Appointment</p>
                  <p className="text-sm">{selectedPatient.nextAppointment}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Medical History</p>
                <p className="text-sm">{selectedPatient.medicalHistory}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Ongoing Treatments</p>
                <p className="text-sm">{selectedPatient.ongoingTreatments}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Allergies</p>
                <p className="text-sm">{selectedPatient.allergies.join("', '") || "'None'"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Notes</p>
                <p className="text-sm">{selectedPatient.notes}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsPatientProfileOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}