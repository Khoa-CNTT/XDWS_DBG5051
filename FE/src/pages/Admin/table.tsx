import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TableData {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Reservation {
  id: string;
  tableId: string;
  customerName: string;
  customerPhone: string;
  numberOfGuests: number;
  reservationTime: string;
  status: string;
}

export default function TablePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "createdAt");
  const [order, setOrder] = useState(searchParams.get("order") || "desc");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [totalPages, setTotalPages] = useState(1);
  
  // Add new state variables for reservation handling
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedTableForReservation, setSelectedTableForReservation] = useState<TableData | null>(null);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/tables?search=${search}&status=${status}&sort=${sort}&order=${order}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setData(result.data);
        setTotalPages(result.totalPages);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, status, sort, order, page, user?.token, toast]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    setSearchParams({ search: value, status, sort, order, page: "1" });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
    setSearchParams({ search, status: value, sort, order, page: "1" });
  };

  const handleSort = (value: string) => {
    setSort(value);
    setPage(1);
    setSearchParams({ search, status, sort: value, order, page: "1" });
  };

  const handleOrder = (value: string) => {
    setOrder(value);
    setPage(1);
    setSearchParams({ search, status, sort, order: value, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSearchParams({ search, status, sort, order, page: newPage.toString() });
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/tables/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const response = await fetch(`/api/tables/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });

      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectReservation = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject reservation');
      }

      toast({
        title: "Success",
        description: "Reservation rejected successfully",
      });

      // Refresh the data
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject reservation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAcceptReservation = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to accept reservation');
      }

      toast({
        title: "Success",
        description: "Reservation accepted successfully",
      });

      // Refresh the data
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept reservation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShowQRCode = (table: TableData) => {
    setSelectedTableForReservation(table);
    setIsQRCodeModalOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Tables Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="sort">Sort By</Label>
              <Select value={sort} onValueChange={handleSort}>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Select sort field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created At</SelectItem>
                  <SelectItem value="updatedAt">Updated At</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="order">Order</Label>
              <Select value={order} onValueChange={handleOrder}>
                <SelectTrigger id="order">
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell>
                          {format(new Date(item.createdAt), "PPP", { locale: vi })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(item.updatedAt), "PPP", { locale: vi })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add QR Code Modal */}
      <Dialog open={isQRCodeModalOpen} onOpenChange={setIsQRCodeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Table QR Code</DialogTitle>
          </DialogHeader>
          {selectedTableForReservation && (
            <div className="flex flex-col items-center gap-4">
              {/* Add your QR code component here */}
              <p>QR Code for Table: {selectedTableForReservation.name}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 