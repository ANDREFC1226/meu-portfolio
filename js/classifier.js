export const CATEGORY_META = {
  'Tecnologia': { icon: '💻' },
  'Administração': { icon: '📊' },
  'Idiomas': { icon: '🌐' },
  'Design': { icon: '🎨' },
  'Saúde': { icon: '🩺' },
  'Outros': { icon: '📁' }
};

const KEYWORDS = {
  'Tecnologia': ['python','javascript','java','html','css','programação','desenvolvimento','software',' ti ','tecnologia','dados','data science','cloud','aws','azure','react','sql','banco de dados','redes','cibersegurança','segurança da informação','power bi','excel avançado'],
  'Administração': ['administração','gestão','negócios','marketing','vendas','financeiro','recursos humanos',' rh ','liderança','projetos','empreendedorismo','logística','contabilidade'],
  'Idiomas': ['inglês','espanhol','francês','alemão','toefl','ielts','idioma'],
  'Design': ['design','photoshop','figma','illustrator','ui/ux',' ux ',' ui ','ilustração','fotografia'],
  'Saúde': ['saúde','enfermagem','primeiros socorros','nutrição','psicologia','fisioterapia']
};

// Se o certificado já tiver uma "category" definida manualmente, ela vence.
// Senão, o texto do título + instituição é analisado por palavras-chave.
export function classify(cert) {
  if (cert.category) return cert.category;
  const text = `${cert.title} ${cert.issuer || ''}`.toLowerCase();
  for (const [cat, words] of Object.entries(KEYWORDS)) {
    if (words.some(w => text.includes(w))) return cat;
  }
  return 'Outros';
}
