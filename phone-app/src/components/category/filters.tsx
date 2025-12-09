"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUrlState } from "@/hook/use-url-state";
import { FILTERS, CategoryKey } from "@/lib/category";

const schema = z.object({
  brand: z.array(z.string()).optional(),
  ram: z.array(z.coerce.number()).optional(),
  storage: z.array(z.coerce.number()).optional(),
  price: z.string().optional().nullable(),
});
export type FilterValues = z.infer<typeof schema>;

export default function Filters({ category }: { category: CategoryKey }) {
  const { params, setParams } = useUrlState();
  const form = useForm<FilterValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      brand: params.getAll("brand"),
      ram: params.getAll("ram").map(Number),
      storage: params.getAll("storage").map(Number),
      price: params.get("price") ?? undefined,
    },
  });

  const onApply = (v: FilterValues) => {
    setParams({
      brand: v.brand,
      ram: v.ram?.map(String),
      storage: v.storage?.map(String),
      price: v.price ?? undefined,
      page: undefined,
    });
  };
  const onReset = () => {
    form.reset({ brand: [], ram: [], storage: [], price: undefined });
    setParams({
      brand: undefined,
      ram: undefined,
      storage: undefined,
      price: undefined,
      page: undefined,
    });
  };

  const brands = FILTERS.brand(category);

  return (
    <div className="rounded-2xl border bg-white p-4 space-y-4 sticky top-20">
      <h3 className="font-semibold text-lg">Bộ lọc</h3>
      <section>
        <div className="font-medium mb-2">Thương hiệu</div>
        <div className="grid grid-cols-2 gap-2">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-2">
              <Checkbox
                checked={form.watch("brand")?.includes(b) ?? false}
                onCheckedChange={(ck) => {
                  const cur = new Set(form.getValues("brand") ?? []);
                  ck ? cur.add(b) : cur.delete(b);
                  form.setValue("brand", Array.from(cur));
                }}
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </section>
      <Separator />
      <section>
        <div className="font-medium mb-2">RAM</div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.ram.map((r) => (
            <label
              key={r}
              className="inline-flex items-center gap-2 px-2 py-1 rounded-md border"
            >
              <Checkbox
                checked={form.watch("ram")?.includes(r) ?? false}
                onCheckedChange={(ck) => {
                  const cur = new Set(form.getValues("ram") ?? []);
                  ck ? cur.add(r) : cur.delete(r);
                  form.setValue("ram", Array.from(cur));
                }}
              />
              <span>{r}GB</span>
            </label>
          ))}
        </div>
      </section>
      <Separator />
      <section>
        <div className="font-medium mb-2">Bộ nhớ</div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.storage.map((s) => (
            <label
              key={s}
              className="inline-flex items-center gap-2 px-2 py-1 rounded-md border"
            >
              <Checkbox
                checked={form.watch("storage")?.includes(s) ?? false}
                onCheckedChange={(ck) => {
                  const cur = new Set(form.getValues("storage") ?? []);
                  ck ? cur.add(s) : cur.delete(s);
                  form.setValue("storage", Array.from(cur));
                }}
              />
              <span>{s}GB</span>
            </label>
          ))}
        </div>
      </section>
      <Separator />
      <section>
        <div className="font-medium mb-2">Khoảng giá</div>
        <div className="grid gap-2">
          {FILTERS.priceRange.map((p) => (
            <label key={p.id} className="flex items-center gap-2">
              <input
                type="radio"
                name="price"
                value={p.id}
                checked={form.watch("price") === p.id}
                onChange={(e) => form.setValue("price", e.target.value)}
              />
              <span>{p.label}</span>
            </label>
          ))}
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="price"
              value=""
              checked={!form.watch("price")}
              onChange={() => form.setValue("price", undefined)}
            />
            <span>Không áp dụng</span>
          </label>
        </div>
      </section>
      <div className="flex gap-2 pt-2">
        <Button className="flex-1" onClick={form.handleSubmit(onApply)}>
          Áp dụng
        </Button>
        <Button variant="secondary" onClick={onReset}>
          Xóa lọc
        </Button>
      </div>
    </div>
  );
}
