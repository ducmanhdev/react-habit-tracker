import {lazy, Suspense, memo, useMemo} from 'react';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import {convertToKebabCase} from "@/utils/string.ts";

const fallbackIcon = 'message-circle-warning';
const fallback = <div style={{ background: '#ddd', width: 24, height: 24 }}/>

export type IconProps = Omit<LucideProps, 'ref'> & {
    // name: keyof typeof dynamicIconImports;
    name: string | undefined;
}

const Icon = ({ name = fallbackIcon, ...props }: IconProps) => {
    const LucideIcon = useMemo(() => {
        const kebabCaseName = convertToKebabCase(name) as keyof typeof dynamicIconImports;
        return lazy(dynamicIconImports[kebabCaseName] || dynamicIconImports[fallbackIcon]);
    }, [name]);
    return (
        <Suspense fallback={fallback}>
            <LucideIcon {...props} />
        </Suspense>
    );
}

export default memo(Icon);
