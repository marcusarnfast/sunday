"use client";

import { Button } from "@sunday/ui/components/button";

type TabItem<T extends string> = {
  label: string;
  value: T;
  icon: React.ElementType;
};

type HeaderTabsNavProps<T extends string> = {
  tabs: readonly TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function HeaderTabsNav<T extends string>({
  tabs,
  value,
  onChange,
}: HeaderTabsNavProps<T>) {
  return (
    <div className="w-full text-foreground">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Button
            key={tab.value}
            data-state={value === tab.value ? "active" : "inactive"}
            onClick={() => onChange(tab.value)}
            size="sm"
            variant="ghost"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-[1px] after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <Icon className="opacity-60" size={16} aria-hidden="true" />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}
