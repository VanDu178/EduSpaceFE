import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  UsersIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface SubMenuItem {
  key: string;
  label: string;
  path: string;
}

interface ParentMenuItem {
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: SubMenuItem[];
}

const menuTree: ParentMenuItem[] = [
  {
    key: 'products-services',
    title: 'Sản phẩm & Dịch vụ',
    icon: SparklesIcon,
    items: [
      {
        key: 'blogs',
        label: 'Bài viết',
        path: '/admin/blogs',
      },
      {
        key: 'membership-plans',
        label: 'Gói hội viên',
        path: '/admin/membership-plans',
      },
    ],
  },
  {
    key: 'accounting',
    title: 'Kế toán',
    icon: TicketIcon,
    items: [
      {
        key: 'subscriptions',
        label: 'Quản lý đăng ký gói dịch vụ',
        path: '/admin/subscriptions',
      },
      {
        key: 'payment-transactions',
        label: 'Giao dịch VietQR',
        path: '/admin/payment-transactions',
      },
    ],
  },
  {
    key: 'account',
    title: 'Tài khoản',
    icon: UsersIcon,
    items: [
      {
        key: 'users',
        label: 'Danh sách người dùng',
        path: '/admin/users',
      },
    ],
  },
  {
    key: 'settings',
    title: 'Thiết lập',
    icon: AdjustmentsHorizontalIcon,
    items: [
      {
        key: 'payment-accounts',
        label: 'Tài khoản thanh toán',
        path: '/admin/payment-accounts',
      },
      {
        key: 'vietqr-banks',
        label: 'Ngân hàng VietQR',
        path: '/admin/vietqr-banks',
      },
      {
        key: 'payment-methods',
        label: 'Phương thức thanh toán',
        path: '/admin/payment-methods',
      },
    ],
  },
];

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const isSubItemActive = (path: string) => location.pathname.includes(path);

  const isParentActive = (parent: ParentMenuItem) => {
    return parent.items.some((item) => isSubItemActive(item.path));
  };

  // State theo dõi danh sách các menu cha đang được mở (xổ xuống)
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});

  // Tự động mở menu cha chứa route con đang active khi URL thay đổi (Accordion mode)
  useEffect(() => {
    const activeParent = menuTree.find((parent) => isParentActive(parent));
    if (activeParent) {
      setOpenKeys({ [activeParent.key]: true });
    }
  }, [location.pathname]);

  const toggleParent = (parentKey: string) => {
    setOpenKeys((prev) => (prev[parentKey] ? {} : { [parentKey]: true }));
  };

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-200/80 text-slate-500 flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300`}>
      {/* Toggle button - floating on the border */}
      <button
        onClick={onToggle}
        className="absolute -right-3.5 top-20 w-7 h-7 bg-white border border-slate-200/80 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer z-50 transition-all duration-200 active:scale-95"
        title={isCollapsed ? 'Mở rộng menu' : 'Thu nhỏ menu'}
      >
        {isCollapsed ? (
          <ChevronRightIcon className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeftIcon className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Brand logo section */}
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-slate-100 bg-white transition-all duration-300`}>
        <div className="flex items-center space-x-3 overflow-hidden">
          <img src="/logo.png" alt="TradeVerse Logo" className="w-15 h-15 object-contain shrink-0" />
          <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
            <h1 className="text-lg font-bold text-slate-800 tracking-wide whitespace-nowrap">TradeVerse</h1>
            <p className="text-[10px] text-sky-600 font-bold tracking-wider uppercase whitespace-nowrap">Trang quản trị</p>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-3'} py-4 space-y-1.5 overflow-y-auto transition-all duration-300`}>
        {menuTree.map((parent) => {
          const parentActive = isParentActive(parent);
          const isOpen = !!openKeys[parent.key];
          const Icon = parent.icon;

          // Cấu hình menu xổ ra cho Antd Dropdown khi Sidebar thu nhỏ (isCollapsed = true)
          const dropdownMenuItems: MenuProps['items'] = parent.items.map((subItem) => {
            const active = isSubItemActive(subItem.path);
            return {
              key: subItem.key,
              label: (
                <Link
                  to={subItem.path}
                  className={`block py-1.5 px-3 text-xs font-medium rounded-md ${active ? 'bg-sky-50 text-sky-600 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  {subItem.label}
                </Link>
              ),
            };
          });

          // Render dạng THU NHỎ (Collapsed)
          if (isCollapsed) {
            return (
              <Dropdown
                key={parent.key}
                menu={{ items: dropdownMenuItems }}
                placement="topRight"
                trigger={['hover', 'click']}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 mx-auto rounded-xl cursor-pointer transition-all duration-200 ${parentActive
                    ? 'bg-sky-50/80 text-sky-600 font-semibold'
                    : 'hover:bg-slate-50 hover:text-slate-800 text-slate-400'
                    }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                </div>
              </Dropdown>
            );
          }

          // Render dạng MỞ RỘNG (Expanded)
          return (
            <div key={parent.key} className="space-y-1">
              {/* Nút Cấp Cha (Parent) */}
              <button
                onClick={() => toggleParent(parent.key)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${parentActive
                  ? 'bg-slate-100/70 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors duration-200 ${parentActive ? 'text-sky-600' : 'text-slate-400'
                      }`}
                  />
                  <span className="text-sm tracking-wide whitespace-nowrap">{parent.title}</span>
                </div>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-slate-600' : 'text-slate-400'
                    }`}
                />
              </button>

              {/* Danh sách Menu Cấp Con (Sub-items) */}
              {isOpen && (
                <div className="pr-1 space-y-1 pt-0.5 pb-1 ml-2 transition-all">
                  {parent.items.map((subItem) => {
                    const active = isSubItemActive(subItem.path);

                    return (
                      <Link
                        key={subItem.key}
                        to={subItem.path}
                        className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-150 ${active
                          ? 'bg-sky-50/80 text-sky-600 font-semibold pl-3.5'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                          }`}
                      >
                        <span className="truncate">{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside >
  );
};

export default Sidebar;
