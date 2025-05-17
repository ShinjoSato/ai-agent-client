import { EnhancedAvatar } from "@/components/common/EnhancedAvatar";

export const RoleLine = ({src, batchIcon, message}) => {
    return (
        <div className="flex rounded-lg p-1 mb-1 bg-black/30 backdrop-blur">
            <EnhancedAvatar
                shape="rounded"
                size="lg"
                src={src}
                alt="Extra Large Avatar"
                bottomRightBadge={batchIcon}
                bottomRightBadgeBg="#22c55e"
            />
            <div className="flex-1 px-1 text-sm flex items-center justify-center">
                {message}
            </div>
        </div>
    )
}
