const I18N = {
  en: {
    dir: 'ltr',
    name: 'Noor Hifz',
    tagline: 'Online Quran memorization with qualified teachers',
    lang_switch: 'العربية',
    nav_teachers: 'Teachers', nav_dashboard: 'Dashboard', nav_login: 'Log in', nav_signup: 'Sign up', nav_logout: 'Log out',
    hero_title: 'Memorize the Quran with a teacher you choose',
    hero_sub: 'Built for non-Arabic speakers. Browse teachers, compare their star ratings, and start one-to-one lessons in your own language.',
    cta_find: 'Find a teacher', cta_teach: 'Become a teacher',
    how_title: 'How it works',
    step1_t: 'Choose your teacher', step1_d: 'Filter by language, service and rating. Read real reviews from other students.',
    step2_t: 'Chat on WhatsApp', step2_d: 'Tap one button to message your teacher and agree on a schedule.',
    step3_t: 'Learn live', step3_d: 'Your teacher sends you a link to a video-call app and the lesson begins.',
    note_external: 'Lessons are held on an external video app (such as Zoom or Google Meet). Your teacher shares the link with you on WhatsApp.',
    teachers_title: 'Our teachers',
    search_ph: 'Search by name…', all_langs: 'Any language', all_services: 'Any service',
    min_rating: 'Minimum rating', any: 'Any', any_gender: 'Any gender', male: 'Male', female: 'Female',
    no_results: 'No teachers match your filters.',
    verified: 'Verified', years: 'yrs experience', per_hour: '/ hour', free_price: 'Ask teacher', view_profile: 'View profile',
    new_teacher: 'New', ijazah: 'Holds an Ijazah',
    reviews: 'Student reviews', no_reviews: 'No reviews yet.',
    contact_wa: 'Contact on WhatsApp', students_only: 'Only student accounts can contact teachers.',
    email: 'Email', password: 'Password (min 6)', full_name: 'Full name', country: 'Country', whatsapp: 'WhatsApp number',
    whatsapp_hint: 'With country code, e.g. 201012345678', i_am: 'I am a…', student: 'Student', teacher: 'Teacher',
    login: 'Log in', signup: 'Create account', have_account: 'Already have an account?', no_account: 'New here?',
    check_email: 'Account created! Please confirm your email, then log in.',
    bad_whatsapp: 'Enter a valid WhatsApp number with country code (8–15 digits).',
    dash_title: 'My dashboard', my_teachers: 'My teachers', no_teachers_yet: 'You haven\'t contacted any teacher yet.',
    rate_hint: 'Rate your teacher', your_comment: 'Your comment (optional)', save: 'Save', saved: 'Saved ✓',
    requests_title: 'Students who contacted me', no_requests: 'No students yet.', chat_student: 'Chat',
    my_profile: 'My profile', bio: 'About me', languages: 'Teaching languages', services: 'Services',
    price: 'Price per hour (USD)', experience: 'Years of experience', has_ijazah: 'I hold an Ijazah',
    is_active: 'Show my profile to students', gender: 'Gender',
    stat_rating: 'Average rating', stat_students: 'Students',
    svc_noorani: 'Noorani Qaidah', svc_tajweed: 'Tajweed', svc_hifz: 'Memorization (Hifz)',
    svc_recitation: 'Recitation correction', svc_revision: 'Revision (Muraja\'ah)',
    loading: 'Loading…', error: 'Something went wrong', back: '← Back',
    setup_title: 'Setup needed', setup_body: 'Open config.js and add your Supabase URL and anon key.',
    footer: 'Noor Hifz — connecting students with Quran teachers.',
    wa_msg: 'Assalamu alaykum {teacher}, I am {name} from {country}. I found you on Noor Hifz and I would like to start Quran memorization lessons.'
  },
  ar: {
    dir: 'rtl',
    name: 'نور الحفظ',
    tagline: 'تحفيظ القرآن الكريم أونلاين مع معلمين مؤهلين',
    lang_switch: 'English',
    nav_teachers: 'المعلمون', nav_dashboard: 'لوحتي', nav_login: 'دخول', nav_signup: 'حساب جديد', nav_logout: 'خروج',
    hero_title: 'احفظ القرآن مع معلم تختاره بنفسك',
    hero_sub: 'مصمّم للناطقين بغير العربية. تصفّح المعلمين وقارن تقييماتهم بالنجوم وابدأ دروسًا فردية بلغتك.',
    cta_find: 'ابحث عن معلم', cta_teach: 'انضم كمعلم',
    how_title: 'كيف يعمل؟',
    step1_t: 'اختر معلمك', step1_d: 'صفِّ حسب اللغة والخدمة والتقييم، واقرأ آراء الطلاب الحقيقية.',
    step2_t: 'تواصل عبر واتساب', step2_d: 'بضغطة زر تراسل المعلم وتتفقان على الموعد.',
    step3_t: 'تعلّم مباشرة', step3_d: 'يرسل لك المعلم رابط تطبيق مكالمات الفيديو وتبدأ الحصة.',
    note_external: 'تتم الحصص عبر تطبيق خارجي (مثل Zoom أو Google Meet) ويرسل لك المعلم الرابط على واتساب.',
    teachers_title: 'معلمونا',
    search_ph: 'ابحث بالاسم…', all_langs: 'أي لغة', all_services: 'أي خدمة',
    min_rating: 'أقل تقييم', any: 'الكل', any_gender: 'الكل', male: 'ذكر', female: 'أنثى',
    no_results: 'لا يوجد معلمون مطابقون.',
    verified: 'موثّق', years: 'سنة خبرة', per_hour: '/ ساعة', free_price: 'اسأل المعلم', view_profile: 'عرض الملف',
    new_teacher: 'جديد', ijazah: 'حاصل على إجازة',
    reviews: 'آراء الطلاب', no_reviews: 'لا توجد تقييمات بعد.',
    contact_wa: 'تواصل عبر واتساب', students_only: 'التواصل مع المعلمين متاح لحسابات الطلاب فقط.',
    email: 'البريد الإلكتروني', password: 'كلمة المرور (6 على الأقل)', full_name: 'الاسم الكامل', country: 'الدولة', whatsapp: 'رقم واتساب',
    whatsapp_hint: 'مع كود الدولة مثال: 201012345678', i_am: 'أنا…', student: 'طالب', teacher: 'معلم',
    login: 'تسجيل الدخول', signup: 'إنشاء حساب', have_account: 'لديك حساب؟', no_account: 'جديد هنا؟',
    check_email: 'تم إنشاء الحساب! فضلًا أكّد بريدك ثم سجّل الدخول.',
    bad_whatsapp: 'أدخل رقم واتساب صحيحًا مع كود الدولة (من 8 إلى 15 رقمًا).',
    dash_title: 'لوحتي', my_teachers: 'معلميّ', no_teachers_yet: 'لم تتواصل مع أي معلم بعد.',
    rate_hint: 'قيّم معلمك', your_comment: 'تعليقك (اختياري)', save: 'حفظ', saved: 'تم الحفظ ✓',
    requests_title: 'الطلاب الذين تواصلوا معي', no_requests: 'لا يوجد طلاب بعد.', chat_student: 'مراسلة',
    my_profile: 'ملفي الشخصي', bio: 'نبذة عني', languages: 'لغات التدريس', services: 'الخدمات',
    price: 'سعر الساعة (دولار)', experience: 'سنوات الخبرة', has_ijazah: 'حاصل على إجازة',
    is_active: 'إظهار ملفي للطلاب', gender: 'النوع',
    stat_rating: 'متوسط التقييم', stat_students: 'الطلاب',
    svc_noorani: 'القاعدة النورانية', svc_tajweed: 'التجويد', svc_hifz: 'الحفظ',
    svc_recitation: 'تصحيح التلاوة', svc_revision: 'المراجعة',
    loading: 'جارٍ التحميل…', error: 'حدث خطأ ما', back: '→ رجوع',
    setup_title: 'مطلوب إعداد', setup_body: 'افتح ملف config.js وضع رابط Supabase والمفتاح العام.',
    footer: 'نور الحفظ — نربط الطلاب بمعلمي القرآن.',
    wa_msg: 'السلام عليكم {teacher}، أنا {name} من {country}. وجدتك على منصة نور الحفظ وأرغب في بدء دروس تحفيظ القرآن.'
  }
};

let LANG = 'en';
function t(k) { return (I18N[LANG] && I18N[LANG][k]) ?? I18N.en[k] ?? k; }
function tf(k, vars) { return t(k).replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? ''); }
function setLang(l) {
  if (!I18N[l]) l = 'en';
  LANG = l;
  try { localStorage.setItem('lang', l); } catch (e) {}
  document.documentElement.lang = l;
  document.documentElement.dir = I18N[l].dir;
  document.title = t('name') + ' — ' + t('tagline');
}
