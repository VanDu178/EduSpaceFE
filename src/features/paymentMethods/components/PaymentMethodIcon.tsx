import {
  QrCodeIcon,
  CreditCardIcon,
  WalletIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import type { FC, SVGProps } from 'react';

const ICON_MAP: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  QrCodeIcon,
  CreditCardIcon,
  WalletIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
};

interface PaymentMethodIconProps {
  iconName?: string | null;
  className?: string;
}

export const PaymentMethodIcon = ({ iconName, className = 'h-4 w-4 text-sky-600' }: PaymentMethodIconProps) => {
  if (!iconName) return <CreditCardIcon className={className} />;
  const normalized = iconName.trim();
  const IconComponent = ICON_MAP[normalized] || ICON_MAP[`${normalized}Icon`] || CreditCardIcon;
  return <IconComponent className={className} />;
};

export default PaymentMethodIcon;

