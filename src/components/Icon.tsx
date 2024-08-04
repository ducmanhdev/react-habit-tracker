import { lazy, Suspense } from 'react';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

const fallback = <div style={{ background: '#ddd', width: 24, height: 24 }}/>

export type IconProps = Omit<LucideProps, 'ref'> & {
    name: keyof typeof dynamicIconImports;
}

const Icon = ({ name, ...props }: IconProps) => {
    if (!dynamicIconImports[name]) {
        name = 'message-circle-warning'
    }

    const LucideIcon = lazy(dynamicIconImports[name]);

    return (
        <Suspense fallback={fallback}>
            <LucideIcon {...props} />
        </Suspense>
    );
}

export default Icon