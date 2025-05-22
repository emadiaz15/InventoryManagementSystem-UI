import React, { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/solid'

/**
 * Componente específico para seleccionar estado con puntito coloreado.
 * Props:
 *  - name, label, value, onChange  (igual API que un <select>)
 *  - options: [{ value, label: ReactNode, disabled? }]
 *  - required?, loading?
 */
const StatusSelect = ({
    name,
    label,
    value,
    onChange,
    options = [],
    required = false,
    loading = false,
}) => {
    const selected = options.find(opt => opt.value === value)

    return (
        <div className="mb-4">
            <Listbox
                value={value}
                onChange={val => onChange({ target: { name, value: val } })}
            >
                <Listbox.Label className="block text-sm font-medium text-text-secondary">
                    {label}
                </Listbox.Label>
                <div className="relative mt-1">
                    <Listbox.Button
                        className="relative w-full cursor-default rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        required={required}
                    >
                        <span className="flex items-center">
                            {selected?.label || <span className="text-gray-400">—</span>}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                        </span>
                    </Listbox.Button>

                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {loading
                                ? <div className="p-2 text-center text-gray-500">Cargando...</div>
                                : options.map(opt => (
                                    <Listbox.Option
                                        key={opt.value}
                                        value={opt.value}
                                        disabled={opt.disabled}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-gray-100' : ''
                                            }`
                                        }
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <div className="flex items-center">
                                                    {opt.label}
                                                </div>
                                                {selected && (
                                                    <span
                                                        className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-primary-600' : 'text-primary-500'
                                                            }`}
                                                    >
                                                        <CheckIcon className="h-5 w-5" />
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))
                            }
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    )
}

export default StatusSelect
