-- Add COD to PaymentProvider enum
ALTER TYPE "PaymentProvider" ADD VALUE IF NOT EXISTS 'COD';

-- Add processing to OrderStatus enum
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'processing';
