'use client'

import { useState } from 'react'
import { useCustomers, useCustomerStats } from '@/hooks/use-customers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, Eye, RefreshCw, Users, UserPlus, Crown, Shield } from 'lucide-react'
import Link from 'next/link'
import { Customer } from '@/types/models'

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')

  const { data, isLoading, refetch } = useCustomers({
    page: 1,
    limit: 50,
    search: search || undefined,
    role: roleFilter ? (roleFilter as 'USER' | 'ADMIN') : undefined,
  })

  const { data: stats } = useCustomerStats()

  const customers = data?.data || []
  const meta = data?.meta

  // Format ngày
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  // Get avatar placeholder
  const getAvatarPlaceholder = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Get role badge
  const getRoleBadge = (role: Customer['role']) => {
    if (role === 'ADMIN') {
      return {
        label: 'Admin',
        variant: 'default' as const,
        icon: Shield,
      }
    }
    return {
      label: 'Khách hàng',
      variant: 'secondary' as const,
      icon: Users,
    }
  }

  // Calculate customer tier based on orders/spending (mock for now)
  const getCustomerTier = (customer: Customer) => {
    const orders = customer.totalOrders || 0
    if (orders === 0) return { label: 'Mới', color: 'text-gray-600', icon: UserPlus }
    if (orders >= 10) return { label: 'VIP', color: 'text-amber-600', icon: Crown }
    if (orders >= 3) return { label: 'Thân thiết', color: 'text-blue-600', icon: Users }
    return { label: 'Mới', color: 'text-gray-600', icon: UserPlus }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Khách hàng</h1>
          <p className="text-muted-foreground mt-1">
            Tổng {stats?.totalUsers || meta?.total || 0} khách hàng
            {stats?.recentUsers && (
              <span className="text-green-600 ml-2">(+{stats.recentUsers} mới trong 7 ngày)</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, email, số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Role Filter */}
        <Select
          value={roleFilter || 'all'}
          onValueChange={(val) => setRoleFilter(val === 'all' ? '' : val)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            <SelectItem value="USER">Khách hàng</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset */}
        {(search || roleFilter) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch('')
              setRoleFilter('')
            }}
          >
            Xoá bộ lọc
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-medium text-muted-foreground">Tổng khách hàng</div>
            <div className="text-2xl font-bold mt-2">{stats.totalUsers || 0}</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-medium text-muted-foreground">Khách mới (7 ngày)</div>
            <div className="text-2xl font-bold mt-2 text-green-600">{stats.recentUsers || 0}</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-medium text-muted-foreground">Admin</div>
            <div className="text-2xl font-bold mt-2 text-blue-600">{stats.totalAdmins || 0}</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-medium text-muted-foreground">Đang hoạt động</div>
            <div className="text-2xl font-bold mt-2 text-amber-600">
              {stats.activeSessions || 0}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Khách hàng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[140px]">Ngày đăng ký</TableHead>
              <TableHead className="w-[120px]">Vai trò</TableHead>
              <TableHead className="text-right w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="w-12 h-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Không tìm thấy khách hàng nào</p>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSearch('')
                        setRoleFilter('')
                      }}
                    >
                      Xoá bộ lọc
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer: Customer) => {
                const tier = getCustomerTier(customer)
                const roleBadge = getRoleBadge(customer.role)
                const RoleIcon = roleBadge.icon

                return (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                          {getAvatarPlaceholder(customer.name)}
                        </div>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          {customer.totalOrders !== undefined && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs ${tier.color}`}>{tier.label}</span>
                              {customer.totalOrders > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  • {customer.totalOrders} đơn
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{customer.email}</TableCell>
                    <TableCell className="text-sm">{formatDate(customer.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant={roleBadge.variant} className="gap-1">
                        <RoleIcon className="w-3 h-3" />
                        {roleBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/customers/${customer.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Xem
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Info */}
      {meta && (
        <div className="text-sm text-muted-foreground text-center">
          Hiển thị {customers.length} / {meta.total} khách hàng
        </div>
      )}
    </div>
  )
}
