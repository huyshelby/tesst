'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { usePromotion, useUpdatePromotion } from '@/hooks/use-promotions'
import { toast } from 'sonner'

const promotionSchema = z.object({
  name: z.string().min(1, 'Tên chương trình là bắt buộc'),
  code: z
    .string()
    .min(3, 'Mã voucher phải có ít nhất 3 ký tự')
    .max(20, 'Mã voucher tối đa 20 ký tự')
    .regex(/^[A-Z0-9]+$/, 'Mã voucher chỉ được chứa chữ in hoa và số'),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  value: z.coerce.number().positive('Giá trị phải lớn hơn 0'),
  minOrderAmount: z.coerce.number().optional(),
  maxDiscount: z.coerce.number().optional(),
  startDate: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
  endDate: z.string().min(1, 'Ngày kết thúc là bắt buộc'),
  usageLimit: z.coerce.number().optional(),
  status: z.enum(['ACTIVE', 'PAUSED']),
})

type PromotionFormData = z.infer<typeof promotionSchema>

export default function EditPromotionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: promotion, isLoading } = usePromotion(params.id)
  const updatePromotion = useUpdatePromotion()

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    values: promotion
      ? {
          name: promotion.name,
          code: promotion.code,
          type: promotion.type,
          value: promotion.value,
          minOrderAmount: promotion.minOrderAmount,
          maxDiscount: promotion.maxDiscount,
          startDate: new Date(promotion.startDate).toISOString().slice(0, 16),
          endDate: new Date(promotion.endDate).toISOString().slice(0, 16),
          usageLimit: promotion.usageLimit,
          status: promotion.status as 'ACTIVE' | 'PAUSED',
        }
      : undefined,
  })

  const watchType = form.watch('type')

  const onSubmit = async (data: PromotionFormData) => {
    try {
      await updatePromotion.mutateAsync({
        id: params.id,
        data,
      })
      toast.success('Cập nhật khuyến mãi thành công')
      router.push('/promotions')
    } catch (error) {
      toast.error('Không thể cập nhật khuyến mãi')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    )
  }

  if (!promotion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground mb-4">Không tìm thấy khuyến mãi</p>
        <Button asChild>
          <Link href="/promotions">Quay lại danh sách</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/promotions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa khuyến mãi</h1>
          <p className="text-muted-foreground">
            Cập nhật thông tin chương trình khuyến mãi
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="rounded-lg border bg-card p-6 space-y-6">
            <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên chương trình <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Giảm giá cuối năm 2025" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tên hiển thị của chương trình khuyến mãi
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mã voucher <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: NEWYEAR2025"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormDescription>
                    Mã mà khách hàng sẽ nhập (chỉ chữ in hoa và số, 3-20 ký tự)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Trạng thái hoạt động</FormLabel>
                    <FormDescription>
                      {field.value === 'ACTIVE'
                        ? 'Khuyến mãi đang hoạt động'
                        : 'Khuyến mãi đang tạm dừng'}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === 'ACTIVE'}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? 'ACTIVE' : 'PAUSED')
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="rounded-lg border bg-card p-6 space-y-6">
            <h2 className="text-lg font-semibold">Giá trị giảm giá</h2>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Loại giảm giá <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại giảm giá" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
                      <SelectItem value="FIXED_AMOUNT">Số tiền cố định (₫)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Giá trị {watchType === 'PERCENTAGE' ? '(%)' : '(₫)'}{' '}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={watchType === 'PERCENTAGE' ? '20' : '50000'}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {watchType === 'PERCENTAGE'
                      ? 'Phần trăm giảm giá (VD: 20 = giảm 20%)'
                      : 'Số tiền giảm cố định (VD: 50000 = giảm 50,000₫)'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchType === 'PERCENTAGE' && (
              <FormField
                control={form.control}
                name="maxDiscount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giảm tối đa (₫)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000000"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Số tiền giảm tối đa (để trống nếu không giới hạn)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="rounded-lg border bg-card p-6 space-y-6">
            <h2 className="text-lg font-semibold">Điều kiện áp dụng</h2>

            <FormField
              control={form.control}
              name="minOrderAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá trị đơn hàng tối thiểu (₫)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="500000"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Đơn hàng phải đạt giá trị này mới áp dụng được mã (để trống nếu không
                    giới hạn)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới hạn số lần sử dụng</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Số lần tối đa mã có thể được sử dụng (để trống nếu không giới hạn)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Usage info (read-only) */}
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-medium mb-2">Thống kê sử dụng</p>
              <p className="text-sm text-muted-foreground">
                Đã sử dụng: <span className="font-semibold">{promotion.usageCount}</span> lần
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 space-y-6">
            <h2 className="text-lg font-semibold">Thời gian áp dụng</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ngày bắt đầu <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ngày kết thúc <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={updatePromotion.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updatePromotion.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/promotions">Hủy</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
