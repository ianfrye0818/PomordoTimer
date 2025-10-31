import { cn } from '@/lib/utils'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card } from './card'

interface ReorderableListProps<T extends { order: number }> {
  // Array of objects that must have the 'order' property
  items: T[]
  // Callback function called when the items are reordered
  onReorder?: (items: T[]) => void
  // Function to render each item's content. Received (item, index) as parameters.
  renderItem?: (item: T, index: number) => React.ReactNode
  // Optional class name for the list container
  className?: string
  // Optional class name for items
  itemClassName?: string
  // Optional key extractor function. Defaults to index.
  keyExtractor?: (item: T, index: number) => string | number
}

interface SortableItemProps<T extends { order: number }> {
  item: T
  index: number
  renderItem?: (item: T, index: number) => React.ReactNode
  itemClassName?: string
  keyExtractor?: (item: T, index: number) => string | number
}

function SortableItem<T extends { order: number }>({
  item,
  index,
  renderItem,
  itemClassName,
  keyExtractor = (_, index) => index,
}: SortableItemProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: keyExtractor(item, index),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={cn(
          'p-4 transition-all duration-200',
          isDragging && 'shadow-lg ring-2 ring-primary/20',
          itemClassName,
        )}
      >
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            {renderItem ? (
              renderItem(item, index)
            ) : (
              <div className="text-sm font-medium">{JSON.stringify(item)}</div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export function ReorderableList<T extends { order: number }>({
  items,
  onReorder,
  renderItem,
  className,
  itemClassName,
  keyExtractor = (_, index) => index,
}: ReorderableListProps<T>) {
  const [sortedItems, setSortedItems] = useState<T[]>([])

  useEffect(() => {
    const sorted = [...items].sort((a, b) => a.order - b.order)
    setSortedItems(sorted)
  }, [items])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before starting drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      // Find indices by comparing the keyExtractor result with active/over IDs
      const oldIndex = sortedItems.findIndex(
        (item, idx) => String(keyExtractor(item, idx)) === String(active.id),
      )
      const newIndex = sortedItems.findIndex(
        (item, idx) => String(keyExtractor(item, idx)) === String(over.id),
      )

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newItems = arrayMove(sortedItems, oldIndex, newIndex).map(
          (item, index) => ({
            ...item,
            order: index,
          }),
        )

        setSortedItems(newItems)

        if (onReorder) {
          onReorder(newItems)
        }
      }
    }
  }

  if (sortedItems.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted-foreground', className)}>
        No items to display
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedItems.map((item, index) => keyExtractor(item, index))}
        strategy={verticalListSortingStrategy}
      >
        <div className={cn('space-y-2', className)}>
          {sortedItems.map((item, index) => (
            <SortableItem
              key={keyExtractor(item, index)}
              item={item}
              index={index}
              renderItem={renderItem}
              itemClassName={itemClassName}
              keyExtractor={keyExtractor}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
