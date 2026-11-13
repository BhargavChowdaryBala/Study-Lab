import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'sm' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-brand-50 text-brand-700 border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variants[variant] || variants.default} ${sizes[size] || sizes.sm}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const normalized = (status || '').toUpperCase();

  if (normalized === 'COMPLETED' || normalized === 'APPROVED') {
    return <Badge variant="success">{normalized}</Badge>;
  }
  if (normalized === 'ONGOING' || normalized === 'NOT_REQUIRED') {
    return <Badge variant="primary">{normalized}</Badge>;
  }
  if (normalized === 'PENDING') {
    return <Badge variant="warning">{normalized}</Badge>;
  }
  if (normalized === 'CANCEL' || normalized === 'REJECTED') {
    return <Badge variant="danger">{normalized}</Badge>;
  }

  return <Badge variant="default">{normalized || 'UNKNOWN'}</Badge>;
};

export const RoleBadge = ({ role }) => {
  const normalized = (role || '').toUpperCase();

  if (normalized === 'ADMIN') {
    return <Badge variant="purple">ADMIN</Badge>;
  }
  if (normalized === 'INSTRUCTOR') {
    return <Badge variant="warning">INSTRUCTOR</Badge>;
  }
  return <Badge variant="primary">STUDENT</Badge>;
};

