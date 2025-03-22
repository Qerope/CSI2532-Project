"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash } from "lucide-react"

// Interface matching the database schema exactly
interface Employee {
  employee_id: number
  hotel_id: number
  full_name: string
  address: string
  sin: string
  role: string
}

// Interface for API response which may include joined data
interface EmployeeWithDetails extends Employee {
  hotel_name?: string
}

interface Hotel {
  hotel_id: number
  chain_id: number
  name: string
  classification: number
  num_rooms: number
  address: string
  contact_email: string
  telephone: string
}

export function EmployeeManagement() {
  const { toast } = useToast()

  const [employees, setEmployees] = useState<EmployeeWithDetails[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [isAddingEmployee, setIsAddingEmployee] = useState(false)
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({})

  useEffect(() => {
    fetchEmployees()
    fetchHotels()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/employees")
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      } else {
        throw new Error("Failed to fetch employees")
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
      toast({
        title: "Error",
        description: "Failed to fetch employees. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchHotels = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/hotels")
      if (response.ok) {
        const data = await response.json()
        setHotels(data)
      } else {
        throw new Error("Failed to fetch hotels")
      }
    } catch (error) {
      console.error("Error fetching hotels:", error)
      toast({
        title: "Error",
        description: "Failed to fetch hotels. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddEmployee = async () => {
    if (
      !newEmployee.hotel_id ||
      !newEmployee.full_name ||
      !newEmployee.address ||
      !newEmployee.sin ||
      !newEmployee.role
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("http://localhost:5010/api/employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Employee added successfully.",
        })
        setIsAddingEmployee(false)
        setNewEmployee({})
        fetchEmployees()
      } else {
        throw new Error("Failed to add employee")
      }
    } catch (error) {
      console.error("Error adding employee:", error)
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEmployee = async (employeeId: number) => {
    try {
      const response = await fetch(`http://localhost:5010/api/employee/${employeeId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Employee deleted successfully.",
        })
        fetchEmployees()
      } else {
        throw new Error("Failed to delete employee")
      }
    } catch (error) {
      console.error("Error deleting employee:", error)
      toast({
        title: "Error",
        description: "Failed to delete employee. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Employee Management</h2>
        <Dialog open={isAddingEmployee} onOpenChange={setIsAddingEmployee}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Employee</DialogTitle>
              <DialogDescription>Enter the details for the new employee.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hotel_id" className="text-right">
                  Hotel
                </Label>
                <Select
                  value={newEmployee.hotel_id?.toString() || ""}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, hotel_id: Number.parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels.map((hotel) => (
                      <SelectItem key={hotel.hotel_id} value={hotel.hotel_id.toString()}>
                        {hotel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="full_name" className="text-right">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  value={newEmployee.full_name || ""}
                  onChange={(e) => setNewEmployee({ ...newEmployee, full_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  value={newEmployee.address || ""}
                  onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sin" className="text-right">
                  SIN
                </Label>
                <Input
                  id="sin"
                  value={newEmployee.sin || ""}
                  onChange={(e) => setNewEmployee({ ...newEmployee, sin: e.target.value })}
                  className="col-span-3"
                  placeholder="9-digit number"
                  maxLength={9}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  value={newEmployee.role || ""}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Receptionist">Receptionist</SelectItem>
                    <SelectItem value="Housekeeper">Housekeeper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingEmployee(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEmployee}>Add Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Hotel</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>SIN</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.employee_id}>
                <TableCell>{employee.employee_id}</TableCell>
                <TableCell>{employee.hotel_name || `Hotel #${employee.hotel_id}`}</TableCell>
                <TableCell>{employee.full_name}</TableCell>
                <TableCell>{employee.address}</TableCell>
                <TableCell>{employee.sin}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      employee.role === "Manager"
                        ? "default"
                        : employee.role === "Receptionist"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {employee.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteEmployee(employee.employee_id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {employees.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

