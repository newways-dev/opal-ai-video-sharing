import { UseFormRegister, FieldErrors, FieldValues } from 'react-hook-form'
import { RadioGroupItem } from '@/components/ui/radio-group'
import { ErrorMessage } from '@hookform/error-message'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

type Props = {
  type?: 'text' | 'email' | 'password' | 'number'
  inputType: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio'
  options?: {
    id: string
    label: string
    value: string
  }[]
  label?: string
  placeholder?: string
  register: UseFormRegister<any>
  name: string
  errors: FieldErrors<FieldValues>
  lines?: number
}

const FormGenerator = ({
  type,
  inputType,
  options,
  label,
  placeholder,
  register,
  name,
  errors,
  lines,
}: Props) => {
  switch (inputType) {
    case 'input':
      return (
        <Label
          className="flex flex-col gap-2 text-[#9D9D9D]"
          htmlFor={`input-${name}`}
        >
          {label && label}
          <Input
            id={`input-${name}`}
            type={type}
            placeholder={placeholder}
            className="bg-transparent border-themeGray text-themeGray"
            {...register(name)}
          />
          <ErrorMessage
            name={name}
            errors={errors}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === 'Required' ? '' : message}
              </p>
            )}
          />
        </Label>
      )

    case 'select':
      return (
        <Label htmlFor={`select-${name}`} className="flex flex-col gap-2">
          {label && label}
          <Select {...register(name)}>
            <SelectTrigger
              id={`select-${name}`}
              className="w-full bg-transparent border p-3 rounded-lg"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options?.length &&
                  options.map((option) => (
                    <SelectItem
                      key={option.id}
                      value={option.value}
                      className="dark:bg-muted"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === 'Required' ? '' : message}
              </p>
            )}
          />
        </Label>
      )

    case 'textarea':
      return (
        <Label className="flex flex-col gap-2" htmlFor={`textarea-${name}`}>
          {label && label}
          <Textarea
            className="bg-transparent border-themeGray text-themeTextGray"
            id={`textarea-${name}`}
            placeholder={placeholder}
            rows={lines}
            {...register(name)}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {' '}
                {message === 'Required' ? '' : message}
              </p>
            )}
          />
        </Label>
      )

    case 'checkbox':
      return (
        <Label className="flex items-center gap-2" htmlFor={`checkbox-${name}`}>
          <Checkbox
            id={`checkbox-${name}`}
            className="border-themeGray"
            {...register(name)}
          />
          {label && <span className="text-themeTextGray">{label}</span>}
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === 'Required' ? '' : message}
              </p>
            )}
          />
        </Label>
      )

    case 'radio':
      return (
        <Label className="flex flex-col gap-2">
          {label && label}
          <div className="flex flex-col gap-2">
            {options?.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <RadioGroupItem
                  value={option.value}
                  id={`radio-${name}-${option.id}`}
                  className="border-themeGray"
                  {...register(name)}
                />
                <Label
                  htmlFor={`radio-${name}-${option.id}`}
                  className="text-themeTextGray"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === 'Required' ? '' : message}
              </p>
            )}
          />
        </Label>
      )

    default:
      break
  }
}

export default FormGenerator
