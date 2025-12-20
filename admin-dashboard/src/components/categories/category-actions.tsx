'use client'

import { useRouter } from 'next/navigation'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Category } from '@/hooks/use-categories' // Assuming this type exists

interface CategoryActionsProps {
  category: Category
  onDelete: () => void
}

export function CategoryActions({ category, onDelete }: CategoryActionsProps) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/categories/${category.id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

