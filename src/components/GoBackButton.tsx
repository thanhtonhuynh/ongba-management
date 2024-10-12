'use client';

import { cn } from '@/lib/utils';
import { Button, ButtonProps } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GoBackButtonProps extends ButtonProps {}

export function GoBackButton({ className, ...props }: GoBackButtonProps) {
  const router = useRouter();

  return (
    <Button
      className={cn('flex items-center gap-2', className)}
      {...props}
      onClick={() => router.back()}
    >
      <ArrowLeft size={15} />
      {props.children}
    </Button>
  );
}
