import {memo, isValidElement, ReactElement, cloneElement} from "react";
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
    const content = (
        <>
            {
                isValidElement(icon)
                    ? icon
                    : <Icon name={icon as string}/>
            }
            <span className="flex-grow overflow-hidden text-ellipsis">{label}</span>
            {
                suffixIcon && (
                    isValidElement(suffixIcon)
                        ? cloneElement(suffixIcon, {
                            onClick: e => {
                                e.preventDefault();
                                e.stopPropagation();
                                suffixIconAction?.();
                            }
                        })
                        : (
                            <Icon
                                name={suffixIcon as string}
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    suffixIconAction?.();
                                }}
                            />
                        )
                )
            }
        </>
    );

    return (
        <Button
            asChild
            variant={isActive ? "default" : "ghost"}
            className="w-full justify-start inline-flex cursor-pointer text-ellipsis"
            onClick={onClick}
        >
            {route ? (
                <NavLink to={route}>{content}</NavLink>
            ) : (
                <span>{content}</span>
            )}
        </Button>
    );
};

export default memo(MenuItem);