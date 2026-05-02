package com.cooperativa.votacao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class VotacaoApplication {

	public static void main(String[] args) {
		SpringApplication.run(VotacaoApplication.class, args);
		System.out.println("\n========================================================");
		System.out.println("🚀 BACK-END JAVA RODANDO NA PORTA: 8080");
		System.out.println("========================================================\n");
	}

}
