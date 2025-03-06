'use client';

import { MultipleSelector, type Option } from '@/components/ui/multiple-selector';
import { useState } from 'react';

function MultipleSelectorDemo() {
  const [selected, setSelected] = useState<Option[]>([]);
  
  const groupedOptions: Option[] = [
    { value: 'react', label: 'React', category: 'Frontend' },
    { value: 'vue', label: 'Vue', category: 'Frontend' },
    { value: 'nodejs', label: 'Node.js', category: 'Backend' },
    { value: 'python', label: 'Python', category: 'Backend' },
  ];

  return (
    <div className="p-4 space-y-4">
      <div>
        <MultipleSelector
          placeholder="Select technologies..."
          defaultOptions={groupedOptions}
          groupBy="category"
          onChange={setSelected}
        />
      </div>
    </div>
  );
}

export { MultipleSelectorDemo };