import {memo, isValidElement, ReactElement, cloneElement, MouseEvent} from "react";
import {NavLink, NavLinkProps} from "react-router-dom";
import Icon from "@/components/Icon.tsx";
import {Button} from "@/components/ui/button.tsx";
import {LucideIcon} from "lucide-react";

export type MenuItemProps = {
    route?: NavLinkProps['to'];
    onClick?: () => void;
    icon: string | ReactElement<LucideIcon>;
    label: string;
    suffixIcon?: string | ReactElement<LucideIcon>;
    suffixIconAction?: () => void;
    isActive?: boolean;
}

const MenuItem = ({
                      icon,
                      label,
                      route,
                      onClick,
                      suffixIcon,
                      suffixIconAction,
                      isActive = false
                  }: MenuItemProps) => {


    const prefixIcon = isValidElement(icon)
        ? icon
        : <Icon name={icon}/>

    const handleSuffixIconClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        suffixIconAction?.();
    }

    const suffixIconFinal = suffixIcon && (
        isValidElement(suffixIcon)
            ? cloneElement(suffixIcon as ReactElement, {
                onClick: handleSuffixIconClick
            })
            : <Icon
                name={suffixIcon as string}
                onClick={handleSuffixIconClick}
            />
    )

    const content = (
        <>
            {prefixIcon}
            <span className="flex-grow overflow-hidden text-ellipsis">{label}</span>
            {suffixIconFinal}
        </>
    );

    return (
        <Button
            asChild
            variant={isActive ? "default" : "ghost"}
            className="w-full justify-start inline-flex cursor-pointer text-ellipsis"
            onClick={onClick}
        >
            {
                route
                    ? <NavLink to={route}>{content}</NavLink>
                    : <span>{content}</span>
            }
        </Button>
    );
};

export default memo(MenuItem);