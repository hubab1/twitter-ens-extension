import React, { useEffect, useState } from 'react'
import { OverlayTrigger, Popover, PopoverBody } from 'react-bootstrap'
import { OverlayInjectedProps } from 'react-bootstrap/esm/OverlayTrigger'
import 'bootstrap/dist/css/bootstrap.min.css'
import ethereumClient from '@/lib/eth'

interface PopoverContentProps extends OverlayInjectedProps {
  balance: string
  onMouseLeave: () => void
  onMouseEnter: () => void
}

const PopoverContent = React.forwardRef(
  (
    { onMouseEnter, onMouseLeave, balance, ...props }: PopoverContentProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <Popover
        id={`tooltip-top`}
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...props}
      >
        <PopoverBody>
          <span className="text-base text-center text-black">
            USD:{' '}
            {new Intl.NumberFormat('EN-US', {
              style: 'currency',
              currency: 'USD',
            }).format(
              parseInt(
                (
                  Number.parseFloat(balance) * ethereumClient.ethereumPrice
                ).toFixed(0),
              ),
            )}
            <br />
            ETH: {Number.parseFloat(balance).toFixed(2)}
          </span>
        </PopoverBody>
      </Popover>
    )
  },
)

interface UserDetailsProps {
  text: string
  balance: string
}

export default function UserDetails({ text, balance }: UserDetailsProps) {
  const [showPopover, setShowPopover] = useState<boolean>(false)
  const ref: React.RefObject<HTMLDivElement> = React.createRef()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let setTimeoutConst: any = undefined

  useEffect(() => {
    return () => {
      if (setTimeoutConst) {
        clearTimeout(setTimeoutConst)
      }
    }
  })

  const handleMouseEnter = () => {
    setTimeoutConst = setTimeout(() => {
      setShowPopover(true)
      onMouseEnter()
    }, 0)
  }

  const onMouseEnter = () => {}

  const handleMouseLeave = () => {
    clearTimeout(setTimeoutConst)
    setShowPopover(false)
  }

  return (
    <OverlayTrigger
      placement="right"
      show={showPopover}
      overlay={
        <PopoverContent
          balance={balance}
          ref={ref}
          onMouseEnter={() => {
            setShowPopover(true)
          }}
          onMouseLeave={handleMouseLeave}
        ></PopoverContent>
      }
    >
      <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {text}
      </span>
    </OverlayTrigger>
  )
}
