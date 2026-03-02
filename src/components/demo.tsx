import { ShaderAnimation } from "@/components/ui/shader-animation";

export default function DemoOne() {
  return (
    <div className="fixed inset-0 -z-50 w-full h-full pointer-events-none">
      <ShaderAnimation />
    </div>
  );
}
