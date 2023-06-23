function! iced#ddc#complete(plugin_name, input, lambda_id) abort
  echom printf('FIXME %s', a:input)
  call iced#complete#candidates(
        \ a:input,
        \ {response -> denops#notify(a:plugin_name, a:lambda_id, [response])},
        \ )
endfunction
