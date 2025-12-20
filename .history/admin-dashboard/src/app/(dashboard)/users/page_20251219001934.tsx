'use client'

import { useState } from 'react'
import {
  useUsers,
  useChangeUserRole,
  useToggleUserStatus,
  useDeleteUser,
  useUserStats,
  AdminUser,
} from '@/hooks/use-users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import {
  Search,
  Filter,
  X,
  Shield,
  ShieldCheck,
  User as UserIcon,
  Users,
  UserX,
  UserPlus,
  Lock,
  Unlock,
  MoreVertical,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function UsersPage() {
  // Filters
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Dialogs
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState<'USER' | 'ADMIN'>('USER')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Mutations
  const changeRoleMutation = useChangeUserRole()
  const toggleStatusMutation = useToggleUserStatus()
  const deleteMutation = useDeleteUser()

  // Data fetching
  const { data: users = [], isLoading } = useUsers({
    search,
    role: roleFilter === 'all' ? undefined : (roleFilter as 'USER' | 'ADMIN'),
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
  })
  const { data: stats } = useUserStats()

  const handleResetFilters = () => {
    setSearch('')
    setRoleFilter('all')
    setStatusFilter('all')
  }

  const handleOpenRoleDialog = (user: AdminUser) => {
    setSelectedUser(user)
    setNewRole(user.role)
    setIsRoleDialogOpen(true)
  }

  const handleChangeRole = () => {
    if (!selectedUser) return

    changeRoleMutation.mutate(
      { id: selectedUser.id, role: newRole },
      {
        onSuccess: () => {
          setIsRoleDialogOpen(false)
          setSelectedUser(null)
        },
      }
    )
  }

  const handleToggleStatus = (user: AdminUser) => {
    const newStatus = !user.isActive
    if (!newStatus) {
      // If blocking, show confirmation
      if (confirm(`Bạn có chắc muốn khóa tài khoản ${user.email}?`)) {
        toggleStatusMutation.mutate({ id: user.id, isActive: newStatus })
      }
    } else {
      toggleStatusMutation.mutate({ id: user.id, isActive: newStatus })
    }
  }

  const handleOpenDelete = (user: AdminUser) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    if (!selectedUser) return

    deleteMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
        setSelectedUser(null)
      },
    })
  }

  const getRoleBadge = (role: 'USER' | 'ADMIN') => {
    if (role === 'ADMIN') {
      return (
        <Badge className="gap-1 bg-purple-100 text-purple-800">
          <ShieldCheck className="w-3 h-3" />
          Admin
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="gap-1">
        <UserIcon className="w-3 h-3" />
        User
      </Badge>
    )
  }

  const getStatusBadge = (isActive: boolean | undefined) => {
    if (isActive === false) {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="w-3 h-3" />
          Đã khóa
        </Badge>
      )
    }
    return (
      <Badge className="gap-1 bg-green-100 text-green-800">
        <CheckCircle2 className="w-3 h-3" />
        Hoạt động
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-gray-600 mt-1">Quản lý tài khoản và phân quyền hệ thống</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" />
          Thêm người dùng
        </Button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng số</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Admin</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.admins}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">User</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.users}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoạt động</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bị khóa</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.blocked}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mới tháng này</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.newThisMonth}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Filter className="w-4 h-4" />
          Bộ lọc
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm theo tên hoặc email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="blocked">Bị khóa</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="gap-2"
            disabled={!search && roleFilter === 'all' && statusFilter === 'all'}
          >
            <X className="w-4 h-4" />
            Xóa bộ lọc
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[30%]">Người dùng</TableHead>
              <TableHead className="text-center">Vai trò</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-center">Đơn hàng</TableHead>
              <TableHead className="text-right">Tổng chi tiêu</TableHead>
              <TableHead>Đăng nhập cuối</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Users className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Không tìm thấy người dùng</p>
                    <p className="text-sm mt-1">Thử điều chỉnh bộ lọc của bạn</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="text-center">{getStatusBadge(user.isActive)}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-semibold text-gray-900">
                      {user.totalOrders || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-gray-900">
                      {user.totalSpent ? formatCurrency(user.totalSpent, true) : '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {user.lastLoginAt ? formatDate(new Date(user.lastLoginAt)) : '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {formatDate(new Date(user.createdAt))}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(user)}
                        className={
                          user.isActive === false
                            ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            : 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                        }
                      >
                        {user.isActive === false ? (
                          <Unlock className="w-4 h-4" />
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenRoleDialog(user)}>
                            <Shield className="w-4 h-4 mr-2" />
                            Thay đổi quyền
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleOpenDelete(user)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa tài khoản
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Change Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thay đổi quyền người dùng</DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <div className="mt-2">
                  <p className="font-medium text-gray-900">{selectedUser.name}</p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Vai trò mới</Label>
              <Select value={newRole} onValueChange={(val) => setNewRole(val as 'USER' | 'ADMIN')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      User - Người dùng thường
                    </div>
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Admin - Quản trị viên
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newRole === 'ADMIN' && (
              <div className="bg-amber-50 border border-amber-200 rounded p-3">
                <p className="text-sm text-amber-900">
                  <strong>Lưu ý:</strong> Quyền Admin có thể truy cập toàn bộ hệ thống và thực hiện
                  mọi thao tác.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleChangeRole} disabled={newRole === selectedUser?.role}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa tài khoản?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser && (
                <>
                  Bạn có chắc muốn xóa tài khoản <strong>{selectedUser.email}</strong>?
                  <br />
                  <br />
                  Tất cả dữ liệu liên quan (đơn hàng, đánh giá) sẽ bị xóa. Hành động này không thể
                  hoàn tác.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa tài khoản
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
