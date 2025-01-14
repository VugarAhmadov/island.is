import { defineMessage, defineMessages } from 'react-intl'

export const icDemands = {
  heading: defineMessage({
    id: 'judicial.system.investigation_cases:police_demands.heading',
    defaultMessage: 'Dómkröfur og lagagrundvöllur',
    description:
      'Notaður sem titill á lagagrundvöllur og dómkröfur skrefi í rannsóknarheimildum.',
  }),
  sections: {
    demands: {
      heading: defineMessage({
        id:
          'judicial.system.investigation_cases:police_demands.demands.heading',
        defaultMessage: 'Dómkröfur',
        description:
          'Notaður sem titill fyrir "dómkröfur" hlutann á lagagrundvöllur og dómkröfur skrefi í rannsóknarheimildum.',
      }),
      label: defineMessage({
        id: 'judicial.system.investigation_cases:police_demands.demands.label',
        defaultMessage: 'Krafa lögreglu',
        description:
          'Notaður sem titill í "dómkröfur" textaboxi á lagagrundvöllur og dómkröfur skrefi í rannsóknarheimildum.',
      }),
      placeholder: defineMessage({
        id:
          'judicial.system.investigation_cases:police_demands.demands.placeholder',
        defaultMessage: 'Krafa ákæranda',
        description:
          'Notaður sem skýritexti í "dómkröfur" textaboxi á lagagrundvöllur og dómkröfur skrefi í rannsóknarheimildum.',
      }),
      prefill: defineMessages({
        searchWarrant: {
          id:
            'judicial.system.investigation_cases:police_demands.demands.prefill.search_warrant',
          defaultMessage:
            'Í þágu rannsóknar sakamáls er þess krafist að Héraðsdómur Reykjavíkur veiti lögreglustjóranum á höfuðborgarsvæðinu heimild til leitar í {address}, þar sem {accusedName} á dvalarstað, í því skyni að handtaka hann og hafa uppi á munum sem hald skal leggja á. Heimildin nái til leitar í læstum hirslum og í geymslum tilheyrandi framangreindu húsnæði svo og til rannsóknar á efnisinnihaldi raftækja, svo sem símum, tölvum og öðrum rafrænum gagnavörslumunum, sem þar er að finna.',
          description: 'Sjálfgefinn dómkröfutexti fyrir húsleit',
        },
        bankingSecrecyWaiver: {
          id:
            'judicial.system.investigation_cases:police_demands.demands.prefill.banking_secrecy_waiver',
          defaultMessage:
            'Þess er krafist að [fjármálafyrirtæki - aðrir sem hafa uppl.], verði með úrskurði Héraðsdóms Reykjavíkur gert skylt að láta lögreglu í hendur allar upplýsingar sem þessi fyrirtæki kunna að hafa um banka og fjármálaviðskipti, þ.á.m. bankareikninga, verðbréfa- og afleiðuviðskipti, lánaviðskipti og greiðslukortaviðskipti, gjaldeyriskaup, peningasendingar og bankahólf er varða [aðili, kt.], vegna tímabilsins frá [DD.MM.ÁÁ]',
          description: 'Sjálfgefinn dómkröfutexti fyrir rof bankaleyndar',
        },
        phoneTapping: {
          id:
            'judicial.system.investigation_cases:police_demands.demands.prefill.phone_tapping',
          defaultMessage:
            'Þess er krafist að Héraðsdómur Reykjavíkur úrskurði að lögreglustjóranum á höfuðborgarsvæðinu sé heimilt að hlusta og hljóðrita símtöl úr og í símanúmerin [###-####] auk annara símanúmera sem {accusedName}, hefur í notkun og umráð yfir, frá og með [DD.MM.ÁÁ] til og með [DD.MM.ÁÁ], og jafnframt sé heimilt að nema sms sendingar, þar með taldar sms sendingar á lesanlegu formi, sem sendar eru eða mótteknar með símanúmerunum á sama tíma og hlusta og hljóðrita samtöl við talhólf greindra númera og símtækja á sama tíma.',
          description: 'Sjálfgefinn dómkröfutexti fyrir símhlerun',
        },
        teleCommunications: {
          id:
            'judicial.system.investigation_cases:police_demands.demands.prefill.tele_communications',
          defaultMessage:
            'Þess er krafist að Héraðsdómur Reykjavíkur úrskurði að [fjarskiptafyrirtæki], verði gert skylt að veita lögreglustjóranum á höfuðborgarsvæðinu upplýsingar um hvaða símanúmer hafi verið í sambandi við símanúmerið [###-####] eða önnur númer og símtæki sem {accusedName}, hefur haft til umráða frá og með [DD.MM.ÁÁ] til [DD.MM.ÁÁ] og IMEI númer sem viðkomandi símanúmer nota á sama tímabili, jafnframt sendar og mótteknar sms sendingar, sem og samtöl við talhólf greinds númers, en jafnframt verði upplýst hverjir eru rétthafar þeirra númera sem þannig tengjast greindum númerum á sama tíma. Þá er krafist upplýsinga um netnotkun símanúmersins og símtækja sem og tengingar við símsenda, hvort sem er vegna símtala eða netnotkunar og upplýsinga um gagnanotkun og gagnamagn á sama tímabili. Jafnframt er krafist upplýsinga um þau símanúmer sem tengst hafa IMEI/IMSEI númerum símtækjanna sem ofangreint númer er notað í á sama tímabili. Þá er krafist upplýsinga um hvaða endurvarpa (BASE-stöðvar) í fjarskiptakerfum fyrirtækjanna hafa farið símtöl úr og í ofangreint númer og önnur símanúmer og símtæki sem umráðamaður hefur haft í umráðum á sama tíma.',
          description:
            'Sjálfgefinn dómkröfutexti fyrir upplýsingar um fjarskiptasamskipti',
        },
        trackingEquipment: {
          id:
            'judicial.system.investigation_cases:police_demands.demands.prefill.tracking_equipment',
          defaultMessage:
            'Þess er krafist að Héraðsdómur Reykjavíkur úrskurði um að lögreglustjóranum á höfuðborgarsvæðinu sé heimilt að koma fyrir eftirfararbúnaði á eða í bifreiðunum [#] svo og öðrum þeim bifreiðum sem {accusedName}, kann að hafa umráð yfir á úrskurðartímanum, og fylgjast með staðsetningum/ferðum bifreiðanna án þess að eigandi hennar, ökumaður, farþegar og aðrir hlutaðeigandi viti af því, frá og með [DD.MM.ÁÁ] til og með [DD.MM.ÁÁ]',
          description: 'Sjálfgefinn dómkröfutexti fyrir eftirfararbúnaður',
        },
      }),
    },
    lawsBroken: defineMessages({
      heading: {
        id:
          'judicial.system.investigation_cases:police_demands.laws_broken.heading',
        defaultMessage: 'Lagaákvæði sem brot varða við',
        description:
          'Notaður sem titill fyrir "lagaákvæði sem brot varða við" hlutann á lagagrundvöllur og dómkröfur skrefi í rannsóknarheimildum.',
      },
      label: {
        id:
          'judicial.system.investigation_cases:police_demands.laws_broken.label',
        defaultMessage: 'Lagaákvæði sem ætluð brot {defendant} þykja varða við',
        description:
          'Notaður sem titill í "lagaákvæði sem brot varða við" textaboxi á lagagrundvöllur og dómkröfur skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id:
          'judicial.system.investigation_cases:police_demands.laws_broken.placeholder',
        defaultMessage:
          'Skrá inn þau lagaákvæði sem brotið varðar við, til dæmis 1. mgr. 244 gr. almennra hegningarlaga nr. 19/1940...',
        description:
          'Notaður sem skýritexti í "lagaákvæði sem krafan er byggð á" textaboxi á lagagrundvöllur og dómkröfur skrefi í rannsóknarheimildum.',
      },
    }),
    legalBasis: defineMessages({
      heading: {
        id:
          'judicial.system.investigation_cases:policeDemands.legal_basis.heading',
        defaultMessage: 'Lagaákvæði sem krafan er byggð á',
        description:
          'Notaður sem titill fyrir "lagaákvæði sem krafan er byggð á" hlutann á lagagrundvöllur og dómkröfur skrefi í rannsóknarheimildum.',
      },
      label: {
        id:
          'judicial.system.investigation_cases:policeDemands.legal_basis.label',
        defaultMessage: 'Lagaákvæði sem krafan er byggð á',
        description:
          'Notaður sem titill í "lagaákvæði sem krafan er byggð á" textaboxi á lagagrundvöllur og dómkröfur skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id:
          'judicial.system.investigation_cases:policeDemands.legal_basis.placeholder',
        defaultMessage: 'Hvaða lagaákvæðum byggir krafan á?',
        description:
          'Notaður sem skýritexti í "lagaákvæði sem krafan er byggð á" textaboxi á lagagrundvöllur og dómkröfur skrefi í rannsóknarheimildum.',
      },
    }),
  },
}
