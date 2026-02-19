"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  Upload,
  Sparkles,
  Download,
  CheckCircle2,
  Zap,
  Target,
  Shield,
  ArrowDown,
  Star,
  Play
} from "lucide-react";

interface LandingPageProps {
  onStartClick: () => void;
}

export default function LandingPage({ onStartClick }: LandingPageProps) {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  const scrollToUpload = () => {
    onStartClick();
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Geometric Islamic-inspired pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geometric" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
              <circle cx="30" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geometric)"/>
        </svg>

        {/* Floating gradient orbs */}
        <motion.div
          className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(46,204,113,0.15) 0%, transparent 70%)",
          }}
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-40 left-[5%] w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(30,58,95,0.12) 0%, transparent 70%)",
          }}
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-32"
      >
        {/* Free Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-secondary/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/30 rounded-full">
              <Star className="w-5 h-5 text-secondary fill-secondary" />
              <span className="text-secondary font-bold text-lg">مجاني ١٠٠٪</span>
              <Star className="w-5 h-5 text-secondary fill-secondary" />
            </div>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-black text-center leading-tight mb-6"
        >
          <span className="text-foreground">حوّل سيرتك الذاتية</span>
          <br />
          <span className="relative">
            <span className="relative z-10 text-primary">إلى فرصة عمل</span>
            <motion.span
              className="absolute bottom-2 left-0 right-0 h-4 bg-secondary/30 -z-0 rounded"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              style={{ originX: 1 }}
            />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted text-center max-w-2xl mb-12 leading-relaxed"
        >
          الذكاء الاصطناعي يعيد كتابة سيرتك الذاتية باحترافية
          <br />
          <span className="text-primary font-semibold">مخصصة للوظيفة المستهدفة</span>
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.button
            onClick={scrollToUpload}
            className="group relative px-12 py-5 bg-primary text-white font-bold text-xl rounded-2xl overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative flex items-center gap-3">
              <span>ابدأ الآن مجاناً</span>
              <motion.span
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Upload className="w-6 h-6" />
              </motion.span>
            </span>
          </motion.button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 flex items-center gap-6 text-muted text-sm"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-secondary" />
            <span>لا حاجة لتسجيل</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-secondary" />
            <span>نتائج فورية</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-secondary" />
            <span>متوافق مع ATS</span>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-6 h-6 text-muted" />
        </motion.div>
      </motion.section>

      {/* How It Works Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              كيف يعمل؟
            </h2>
            <p className="text-xl text-muted">
              ثلاث خطوات بسيطة لسيرة ذاتية احترافية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                step: "١",
                title: "ارفع سيرتك",
                description: "ارفع ملف PDF لسيرتك الذاتية الحالية",
                color: "from-primary/20 to-primary/5",
                iconBg: "bg-primary",
                delay: 0,
              },
              {
                icon: Sparkles,
                step: "٢",
                title: "تحليل ذكي",
                description: "الذكاء الاصطناعي يحلل ويحسن المحتوى",
                color: "from-secondary/20 to-secondary/5",
                iconBg: "bg-secondary",
                delay: 0.15,
              },
              {
                icon: Download,
                step: "٣",
                title: "حمّل النتيجة",
                description: "احصل على سيرتك الذاتية المحسنة فوراً",
                color: "from-primary/20 to-primary/5",
                iconBg: "bg-primary",
                delay: 0.3,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: item.delay }}
              >
                <motion.div
                  className={`
                    relative p-8 rounded-3xl
                    bg-gradient-to-br ${item.color}
                    border border-white/50
                    backdrop-blur-sm
                    overflow-hidden
                    group
                  `}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step number */}
                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                    <span className="text-primary font-bold">{item.step}</span>
                  </div>

                  {/* Icon */}
                  <motion.div
                    className={`
                      w-20 h-20 rounded-2xl ${item.iconBg}
                      flex items-center justify-center mb-6
                      shadow-lg
                    `}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <item.icon className="w-10 h-10 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted text-lg">
                    {item.description}
                  </p>

                  {/* Decorative element */}
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/20 group-hover:scale-150 transition-transform duration-500" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-primary/[0.02] to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Play className="w-4 h-4 text-primary fill-primary" />
              <span className="text-primary font-semibold text-sm">شاهد الشرح</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              شاهد كيف يعمل أرزاق
            </h2>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              فيديو قصير يوضح كيفية تحسين سيرتك الذاتية في دقائق
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Decorative background */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-[2rem] blur-2xl opacity-50" />

            {/* Video container */}
            <div className="relative bg-gradient-to-br from-primary to-primary-light p-2 rounded-2xl shadow-2xl shadow-primary/20">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  src="https://www.youtube.com/embed/SR88p3NrcwI?rel=0&modestbranding=1"
                  title="شرح منصة أرزاق"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>

            {/* Floating decorative elements */}
            <motion.div
              className="absolute -top-6 -right-6 w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shadow-lg"
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg"
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <Play className="w-5 h-5 text-white fill-white" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              لماذا أرزاق؟
            </h2>
            <p className="text-xl text-muted">
              مميزات تجعل سيرتك الذاتية تتفوق على المنافسين
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: "💯",
                title: "مجاني بالكامل",
                description: "لا رسوم مخفية، لا اشتراكات، مجاني ١٠٠٪ للجميع",
                gradient: "from-secondary/10 to-emerald-500/5",
                delay: 0,
              },
              {
                icon: "🤖",
                title: "ذكاء اصطناعي متقدم",
                description: "نستخدم أحدث تقنيات الذكاء الاصطناعي لتحسين سيرتك",
                gradient: "from-primary/10 to-blue-500/5",
                delay: 0.1,
              },
              {
                icon: "🎯",
                title: "مخصص للوظيفة",
                description: "نحلل الوصف الوظيفي ونخصص سيرتك لتناسب المتطلبات",
                gradient: "from-amber-500/10 to-orange-500/5",
                delay: 0.2,
              },
              {
                icon: "✅",
                title: "متوافق مع ATS",
                description: "تنسيق احترافي يجتاز أنظمة تتبع المتقدمين",
                gradient: "from-violet-500/10 to-purple-500/5",
                delay: 0.3,
              },
              {
                icon: "🔒",
                title: "خصوصية تامة",
                description: "لا نحتفظ بأي بيانات - سيرتك الذاتية محمية",
                gradient: "from-rose-500/10 to-pink-500/5",
                delay: 0.4,
              },
              {
                icon: "⚡",
                title: "سرعة فائقة",
                description: "احصل على نتائجك في أقل من دقيقة واحدة",
                gradient: "from-cyan-500/10 to-teal-500/5",
                delay: 0.5,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: feature.delay }}
              >
                <motion.div
                  className={`
                    relative p-6 rounded-2xl
                    bg-gradient-to-br ${feature.gradient}
                    border border-white/60
                    backdrop-blur-sm
                    flex items-start gap-5
                    group cursor-default
                  `}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2.5rem] p-12 md:p-16"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-light" />

            {/* Decorative patterns */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="cta-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1.5" fill="white"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cta-pattern)"/>
              </svg>
            </div>

            {/* Floating shapes */}
            <motion.div
              className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white/10"
              animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-10 left-10 w-32 h-32 rounded-2xl bg-secondary/20 rotate-45"
              animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  جاهز لتحسين سيرتك الذاتية؟
                </h2>
                <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                  انضم للآلاف الذين حسّنوا فرصهم في سوق العمل السعودي
                </p>
              </motion.div>

              <motion.button
                onClick={scrollToUpload}
                className="group relative px-12 py-5 bg-white text-primary font-bold text-xl rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative flex items-center gap-3">
                  <span>ابدأ الآن - مجاناً</span>
                  <CheckCircle2 className="w-6 h-6" />
                </span>
              </motion.button>

              <p className="mt-6 text-white/60 text-sm">
                لا يتطلب تسجيل • لا بطاقة ائتمان • نتائج فورية
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
